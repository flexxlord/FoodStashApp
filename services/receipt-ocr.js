import { InteractionManager, Dimensions } from "react-native";

import AppModel from "../models/AppModel";
import FoodItem from "../models/FoodItem";
import utils from "../utils";

import * as Device from "expo-device";
import Constants from "expo-constants";
import dayjs from "dayjs";

export default async function parseReceiptImage(photo) {
  console.log(photo.base64.length);
  console.log("fetchin");
  const apiKey = "4f07720c4888957";

  const b64Image = `data:image/jpg;base64,${photo.base64}`;

  // ocr.space
  const formData = new FormData();
  formData.append("language", "eng");

  formData.append("isOverlayRequired", false);
  formData.append("scale", true);
  formData.append("base64Image", b64Image);
  formData.append("isTable", true);
  formData.append("OCREngine", 2);

  const tinit = performance.now();
  const ocrResp = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: apiKey,
    },
    body: formData,
  });
  const ocrRespJSON = await ocrResp.json();

  const tocr = performance.now();
  console.log(`ocr.space call finished in ${tocr - tinit}`);

  const parseResp = await fetch("http://3.87.225.207:7001/api/v1/parser", {
    method: "POST",
    headers: {
      api_key: "jiateam5",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ocrRespJSON),
  });

  const parseRespJSON = await parseResp.json();

  const tparse = performance.now();
  console.log(`parsing call finished in ${tparse - tocr}`);

  AppModel.foodItems.mergeInFoodItems(
    parseRespJSON.food_items.map((item) => {
      return new FoodItem({
        name: utils.titleCase(item.item_name || "New Item"),
        quantity: item.quantity || 1,
      });
    })
  );

  const tmerge = performance.now();
  console.log(`merging into app data in ${tmerge - tparse}`);
  //console.log(b64Image);

  InteractionManager.runAfterInteractions({
    gen: async () => {
      try {
        const tsavestart = performance.now();
        const metadata = {
          brand: Device.brand,
          manufacturer: Device.manufacturer,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
          deviceName: Device.deviceName || "<no name>",
          dimensions: {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          },
          deviceId: Constants.installationId || "<>",
          sessionId: Constants.sessionId,
          dateString: dayjs().toISOString(),
          parseResults: parseRespJSON,
          performance: {
            ocrspace: tocr - tinit,
            parsing: tparse - tocr,
            appModelUpdate: tmerge - tparse,
          },
        };

        console.log(metadata);
        await fetch("http://3.87.225.207:7001/api/v1/image", {
          method: "POST",
          headers: {
            api_key: "jiateam5",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: b64Image,
            metadata: metadata,
          }),
        });
        const tsaveend = performance.now();
        console.log(`hitting save endpoint took ${tsaveend - tsavestart}`);
        return true;
      } catch (err) {
        console.warn("saving image failed", err);
        return false;
      }
    },
  });

  return parseRespJSON.food_items.length;
}

import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config(); // .env 읽기

// .env 파일에서 API 키 가져오기
const API_KEY = process.env.API_KEY;

// API 기본 URL
const BASE_URL = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03";

// 한 번에 가져올 데이터 개수 (공공데이터포털은 보통 100개씩)
const ROWS = 100;

// API에서 데이터 불러오기
async function fetchData(pageNo = 1) {
  const url = `${BASE_URL}?serviceKey=${API_KEY}&type=json&numOfRows=${ROWS}&pageNo=${pageNo}`;
  const res = await axios.get(url);
  return res.data.body.items || [];
}

// 전체 데이터 불러오기 (페이지네이션 고려)
async function getAllData() {
  let page = 1;
  let allItems = [];
  let hasData = true;

  while (hasData) {
    console.log(`${page} 페이지 불러오는 중...`);
    const items = await fetchData(page);

    if (items.length === 0) {
      hasData = false;
    } else {
      // 필요한 필드만 추출
      const filtered = items.map((item) => ({
        ITEM_SEQ: item.ITEM_SEQ,
        ITEM_NAME: item.ITEM_NAME,
        CLASS_NAME: item.CLASS_NAME,
        MIXTURE_MIX: item.MIXTURE_MIX,
        MIXTURE_ITEM_NAME: item.MIXTURE_ITEM_NAME,
        MIXTURE_MAIN_INGR: item.MIXTURE_MAIN_INGR,
        PROHBT_CONTENT: item.PROHBT_CONTENT,
      }));

      allItems = allItems.concat(filtered);
      page++;
    }
  }

  // JSON 파일로 저장
  fs.writeFileSync("noJointDb.json", JSON.stringify(allItems, null, 2), "utf-8");
  console.log(`총 ${allItems.length}개 데이터 저장 완료 (noJointDb.json)`);
}

// 실행
getAllData();

let drugData = [];

// 1. JSON 데이터 불러오기
fetch("noJointDb.json")
  .then((res) => res.json())
  .then((data) => {
    drugData = data;
  })
  .catch((err) => console.error("JSON 로딩 에러:", err));

// DOM 로딩 후 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  const input1 = document.getElementById("drug1");
  const input2 = document.getElementById("drug2");
  const checkBtn = document.getElementById("check-btn");
  const resultDiv = document.getElementById("result");

  checkBtn.addEventListener("click", () => {
    const d1 = input1.value.trim().toLowerCase();
    const d2 = input2.value.trim().toLowerCase();

    // 2. 입력 체크
    if (!d1 && !d2) {
      resultDiv.textContent = "1번과 2번 검색창의 정보를 입력하세요.";
      return;
    }
    if (!d1) {
      resultDiv.textContent = "1번 검색창의 정보를 입력하세요.";
      return;
    }
    if (!d2) {
      resultDiv.textContent = "2번 검색창의 정보를 입력하세요.";
      return;
    }

    // 4. 1번 약 체크
    const firstDrugList = drugData.filter((item) =>
      [item.ITEM_NAME, item.MIXTURE_ITEM_NAME, item.MIXTURE_MAIN_INGR].some((name) =>
        name?.toLowerCase().includes(d1)
      )
    );

    if (firstDrugList.length === 0) {
      resultDiv.textContent = `${input1.value}는 병용금기 약물이 아닙니다.`;
      return;
    }

    // 5. 2번 약 비교
    const isTaboo = firstDrugList.some((item) =>
      [item.MIXTURE_ITEM_NAME, item.MIXTURE_MAIN_INGR].some((name) =>
        name?.toLowerCase().includes(d2)
      )
    );

    if (isTaboo) {
      resultDiv.textContent = `${input1.value}와 ${input2.value}는 병용금기 약물입니다.`;
    } else {
      resultDiv.textContent = `${input1.value}와 ${input2.value}는 병용금기 약물이 아닙니다.`;
    }
  });
});

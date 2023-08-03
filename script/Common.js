/**
 * 카드 덱의 아이콘을 선택해서 카드 재선택
 */
function setCardByDeckViewDiv(jsonData, selectedIdolName, divId, cardType, offset) {
  let selectedIdx = Object.values(jsonData).findIndex((obj) => {
    return obj.idol_en_name.toLowerCase() == selectedIdolName;
  });

  if (selectedIdx !== -1) {
    let name = jsonData[selectedIdx].idol_en_name.toLowerCase();
    let insight = jsonData[selectedIdx].insight;
    let idolIdx = selectedIdx;

    viewCard(divId, name, insight, idolIdx, cardType, offset);
  }
}

/**
 * 아이돌 선택 버튼 클릭시, 각 아이돌의 이미지를 보여주는 다이얼로그 표시
 * 히라메키 표시가 체크 된 경우, 서포터 아이돌 목록에 히라메키 아이콘도 표시
 */
function viewIdolDialog(parentObj, obj, divId, cardType, offset) {
  $(idolDialogDivId).html("");
  for (var idolIdx = 0; idolIdx < obj.length; idolIdx++) {
    // 파일명이 모두 소문자 영문이기 때문에 영문명을 모두 소문자로
    // Mano -> mano
    var idolNameSrc = obj[idolIdx]["idol_en_name"].toLowerCase();
    var idolInsight = obj[idolIdx]["insight"];

    var parameter = `'#${divId}', '${idolNameSrc}', '${idolInsight}', ${idolIdx}, '${cardType}', ${offset}`;

    // 아이돌 목록 다이얼로그 표시
    // 아이돌 선택시, 해당 아이돌의 카드 목록 전개하도록 세팅
    $(idolDialogDivId).append(
      $("<div>", {
        id: `idolDiv_${idolNameSrc}`,
        style: "display:inline-flex;position: relative;",
        onclick: `viewCard(${parameter})`,
      })
    );

    // 아이돌 이미지 세팅
    $(`#idolDiv_${idolNameSrc}`).append(
      $("<img>", {
        id: `idol_${idolNameSrc}`,
        src: `./img/idol/${idolNameSrc}.png`,
        width: "100px",
        height: "100px",
        class: "dialogImg",
      })
    );

    // 히라메키 표시가 체크되어있는 경우
    // 서포터 아이돌 목록에 히라메키 아이콘을 표시
    var insightChk = $(':radio[name="option_ability"]:checked').val() == "insight";
    if (cardType == "S" && insightChk == true && idolInsight != "")
      $(`#idolDiv_${idolNameSrc}`).append($("<img>", getInsightImg(idolInsight, 1)));
  }

  var dialogTitle = getLanguageStringByData(viewLanguage, "selectIdol");
  // 다이얼로그 세팅
  $(idolDialogDivId).dialog({
    modal: true,
    title: dialogTitle,
    position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
    width: "700px",
  });

  $(".ui-widget-overlay").click(function () {
    $(idolDialogDivId).dialog("close");
  });
}

/**
 * 아이돌 선택시 해당 아이돌의 카드를 표시하도록 세팅 후
 * 선택 할 수 있도록 카드 다이얼로그를 전개
 */
function viewCard(divId, name, insight, idolIdx, cardType, offset) {
  // 1. 지정한 위치에 아이돌 이미지와 히라메키 이미지를 세팅
  $(divId).html($("<img>", getIdolImg(name, insight)));

  // 2. 선택한 아이돌의 카드를 세팅
  setCardList(insight, idolIdx, cardType, offset);

  // 3. 세팅 후 자동으로 카드 선택 버튼을 클릭
  if (cardType == "P") {
    $(`#idolCardBtn_Produce`).click();
  } else if (cardType == "S") {
    $(`#idolCardBtn_Support_${offset}`).click();
  } else {
    $(`#idolCardBtn_${FES_POSITION[offset]}`).click();
  }
}

/**
 * 아이돌 선택시 카드 선택 버튼의 동작을 세팅
 * 카드 종류는 (프로듀스, 서포트, 페스) 3종류로 처리
 *
 * 1. 각 카드 선택 버튼마다 선택한 아이돌 카드를 세팅 후
 * 2. 숨겨놓았던 카드 선택 버튼을 표시
 * 3. 히라메키 표시 설정에 따라 선택한 서포터 아이돌 칸(다이얼로그가 아님)에 히라메키 아이콘을 표시
 */
function setCardList(insight, idolIdx, cardType, offset) {
  $(idolDialogDivId).dialog("close");

  // 프로듀스 카드의 경우
  if (cardType == "P") {
    $("#idolCardBtn_Produce").click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset);
    });
    $("#idolCardBtn_Produce").css("visibility", "visible");
  }
  // 서포터 카드의 경우
  else if (cardType == "S") {
    $(`#idolCardBtn_Support_${offset}`).click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset, insight);
    });
    $(`#idolCardBtn_Support_${offset}`).css("visibility", "visible");

    var insightChk = $(':radio[name="option_ability"]:checked').val() == "insight";
    if (insightChk == true) {
      if (insight != "") {
        $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
          $("<img>", getInsightImg(insight, 1))
        );
      }
    }
  }
  // 페스 카드의 경우
  else {
    $(`#idolCardBtn_${FES_POSITION[offset]}`).click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset);
    });
    $(`#idolCardBtn_${FES_POSITION[offset]}`).css("visibility", "visible");
  }
}

/**
 * 카드 선택 버튼 클릭시 각 아이돌의 카드 이미지를 보여주는 다이얼로그를 표시
 */
function viewCardDialog(parentObj, obj, cardType, offset, insight = "") {
  var type_list;
  var divOffset;
  var imgPath;

  // 1. 카드가 프로듀스(P), 서포트(S), 페스(F) 카드 종류에 따라 표시하는 카드의 등급을 확인
  // P, F : P_SSR, P_SR, P_R : 3종류
  // S : S_SSR, S_SR, S_R, S_N : 4종류
  if (cardType == "P" || cardType == "F") {
    type_list = P_TYPE_LIST;
  } else {
    type_list = S_TYPE_LIST;
  }

  // 2. 카드의 위치(포지션)와 이미지 경로를 설정 (페스 카드의 경우, 사복과 페스 설정에 따라 경로 설정)
  // 사복 (P, S) : "icon_normal/"
  // 페스 (P) : "icon_fes/"
  if (cardType == "P" || cardType == "S") {
    divOffset = offset;
    imgPath = "icon_normal/";
  } else {
    divOffset = FES_POSITION[offset];
    var fesChk = $("#fesImgConvertBtn").is(":checked");
    if (fesChk == true) imgPath = "icon_fes/";
    else imgPath = "icon_normal/";
  }

  // 3. 카드 목록 다이얼로그 표시
  $(cardDialogDivId).html("");
  for (var typeIdx = 0; typeIdx < type_list.length; typeIdx++) {
    if (obj["card_data"][type_list[typeIdx]] == undefined) continue;

    var cardList = obj["card_data"][type_list[typeIdx]];

    $(cardDialogDivId).append(
      `<h3 style='margin: 10px 0px'>${type_list[typeIdx].split("_")[1]}</h3>`
    );

    cardList.forEach((card) => {
      // 카드 목록의 이미지 설정
      // 카드 이미지가 없는 경우 「Blank_Idol.png」을 표시
      $(cardDialogDivId).append(
        $("<img>", {
          id: card.card_addr,
          src: `./img/${imgPath}${card.card_addr}.png`,
          width: "96px",
          height: "96px",
          class: "dialogImg",
          onerror: `this.src="${blankIdolIcon}"`,
        })
      );

      let optionAbility = undefined;
      // 서포트 카드의 경우엔 옵션 능력을 표시할 수 있도록 데이터 취득
      if (cardType == "S") {
        // 카드에 히라메키 정보가 있다면 카드 정보를 우선
        if ("card_insight" in card) {
          insight = card["card_insight"];
        }

        optionAbility = getOptionAbility(card["card_idea"], insight, card["card_prof"].join("_"));
      }

      // 카드 선택시 덱에 입력
      $(`#${card.card_addr}`).click(function () {
        var selDivId = `#selectedIdolView_${divOffset}`;
        setSelectCard(selDivId, imgPath, this.id, optionAbility);
        $(cardDialogDivId).dialog("close");

        // 카드 타입이 S인 경우 히라메키 표시 초기화
        if (cardType == "S") {
          convertOptionAbilityImg($(':radio[name="option_ability"]:checked').val());
        }
      });
    });

    // 각 등급별 구분 라인 추가
    $(cardDialogDivId).append("<hr>");
  }

  // 구체적인 카드 선택이 아닌 경우 처리
  // 구체적인 카드 선택이 아니기에 Other로 처리
  var idolName = obj.idol_en_name.toLowerCase();
  if (idolName != "other") {
    $(cardDialogDivId).append(
      $("<img>", {
        id: `${idolName}_char`,
        src: `./img/icon_char/${idolName}.png`,
        width: "96px",
        height: "96px",
        class: "dialogImg",
        onerror: `this.src="${blankIdolIcon}"`,
      })
    );
    $(`#${idolName}_char`).click(function () {
      var selDivId = `#selectedIdolView_${divOffset}`;

      // 구체적인 카드 선택이 아닌 경우의 옵션 데이터 처리
      // 히라메키를 제외한 나머지 옵션 능력은 알 수 없음
      optionAbility = getOptionAbility("", insight, "");
      setSelectCard(selDivId, `icon_char/`, idolName, optionAbility);
      $(cardDialogDivId).dialog("close");
    });

    // 라인 추가
    $(cardDialogDivId).append("<hr>");
  }

  // 카드 미선택 아이콘 선택 처리
  $(cardDialogDivId).append(
    $("<img>", {
      id: `none_card`,
      src: blankIdolIcon,
      width: "96px",
      height: "96px",
      class: "dialogImg",
      onerror: `this.src="${blankIdolIcon}"`,
    })
  );
  $(`#none_card`).click(function () {
    var selDivId = `#selectedIdolView_${divOffset}`;
    setSelectCard(selDivId, `assets/`, "Blank_Idol");
    $(cardDialogDivId).dialog("close");
  });

  var dialogTitle = getLanguageStringByData(viewLanguage, "selectCard");

  // 다이얼로그 세팅
  $(cardDialogDivId).dialog({
    modal: true,
    title: dialogTitle,
    position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
    width: 600,
  });

  $(".ui-widget-overlay").click(function () {
    $(cardDialogDivId).dialog("close");
  });
}

/**
 * 카드 선택시 해당되는 위치에 카드 이미지 설정
 */
function setSelectCard(divId, imgPath, cardAddr, optionAbility = undefined) {
  var imgObj = {
    id: `${divId.replace("#", "")}_card`,
    src: `./img/${imgPath}${cardAddr}.png`,
    width: "96px",
    height: "96px",
    onerror: `this.src="${blankIdolIcon}"`,
  };

  // 옵션 능력의 데이터를 가지고 있도록 처리
  if (optionAbility != undefined) {
    // 아이디어
    if (optionAbility["idea"] != "") {
      imgObj["idea"] = optionAbility["idea"];
    }

    // 히라메키
    if (optionAbility["insight"] != "") {
      imgObj["insight"] = optionAbility["insight"];
    }

    // 악곡 숙련도
    if (optionAbility["proficiency"] != "") {
      imgObj["proficiency"] = optionAbility["proficiency"];
    }
  }

  $(divId).html($("<img>", imgObj));

  // 옵션 능력 표시 선택에 따른 표시의 처리
  convertOptionAbilityImg($(':radio[name="option_ability"]:checked').val());

  // 카드의 특훈 설정이 가능하도록 설정 및 설정되어 있는 특훈을 적용
  var offset = divId.split("_")[1];
  if (offset in [...Array(6).keys()].map((v) => `${v}`)) {
    setSpecialTraining(offset, $(`#specialTrainingInput_${offset}`).val());
    if ($("#specialTrainingConvertBtn").is(":checked") == true) {
      $(`#specialTrainingInput_${offset}`).prop("disabled", false);
    }
    convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
  }

  // 페스덱 카드의 포지션 이미지 설정
  setFesPosIcon();
}

/**
 * 덱의 단일의 카드 아이콘을 초기화
 */
function viewReset(posId) {
  $(`#selectedIdolView_${posId}`).remove();
}

/**
 * 덱 이미지 표시 간격 설정
 */
function setDeckSpace(deckType, spaceType) {
  var spaceAry;

  if (deckType == "P") {
    if (spaceType == "1") spaceAry = [0, 0, 0, 0, 0];
    else if (spaceType == "2") spaceAry = [1, 1, 1, 1, 1];
    else spaceAry = [1, 0, 0, 0, 0];

    spaceAry.forEach((space, i) => {
      $(`.p_space_div_${i + 1}`).css("margin", `0px ${space * spaceSize}px`);
    });
  } else {
    if (spaceType == "1") spaceAry = [0, 0, 0, 0];
    else spaceAry = [1, 1, 1, 1];

    spaceAry.forEach((space, i) => {
      $(`.f_space_div_${i + 1}`).css("margin", `0px ${space * spaceSize}px`);
    });
  }
}

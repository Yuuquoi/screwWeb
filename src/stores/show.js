import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 儲存畫面呈現相關的方法
export const useShowStore = defineStore('show', () => {

  // 控制模式
  let mode = ref(0)

  function modeChange(page) {
    mode = page;
    console.log(mode);
  }

  // [分頁功能] ( 完整資料, 一頁幾筆資料, 第幾頁) : 該頁的資料陣列
  function page(allData, high, index) {
    let showData = [];
    let startIndex = 0 + (-1)*high;   // 每頁的陣列起始 index
    let largestIndex = high + (index-1)*high;  // 每頁能塞的最大 index
    let endIndex = largestIndex > allData.length? allData.length : largestIndex;   // 如果最大 index 超過陣列長度，那就用陣列長度作為該頁的上限
    for(startIndex; startIndex < endIndex; startIndex++){
        showData.push(allData[startIndex]);   // 根據剛剛設定好的 index 將資料放入要呈現的陣列中
    }
    console.log(showData);
    return showData;
  }

  return { mode, modeChange, page }
})
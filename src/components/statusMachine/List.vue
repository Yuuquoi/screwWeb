<script>
export default{

    // lifecycle
    mounted(){
        // 抓取資料
        this.init();
    },
    beforeUnmount(){
        // 停止計時器
        this.stopTimer();
    },

    //
    methods: {
        init(){
            this.pageNow = 1;

            // 定時更新資料
            this.getNewestData();
            this.timerForNewStatus = setInterval(() => {
                    setTimeout(this.getNewestData(), 0)
                }, this.time);
        },

        // 抓取資料庫新資料
        getNewestData(){

            // 設定更新時間
            const now = new Date();
            this.updateTime = now.getMonth().toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') + ' ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            // 清空
            this.dataList = [];
            this.showList = [];
            this.totalPage = 0;

            // 進入資料庫
            fetch("http://localhost:8080/screw/findmachineDataNow",{
                method: 'GET',
                headers:{
                    "Content-Type":"application/json"
                },
            })
            .then(res => res.json())
            .then((data) => {

                // 處理錯誤訊息
                if(data.code != 200){
                    this.dataList = null;
                    console.log(data);
                    return;
                }

                if(!data.machineDataList){
                    return;
                }

                // 設定顯示資料
                this.totalPage = Math.ceil( data.machineDataList.length / this.high );
                for(let index in data.machineDataList){
                    this.dataList.push(data.machineDataList[index]);
                    if( data.machineDataList[index].status === 'error' ){
                        this.errorList.push(this.turnIntoPage(index));
                        this.errorNotify.push(data.machineDataList[index].name);
                    }
                }

                // 設定倒數動畫
                this.setCountdownAnimation();
    
                // 設定單頁呈現資料
                this.getShowData();

                this.timerForNextPage = setInterval(() => {
                        setTimeout(this.getShowData(), 0)
                    }, this.time*this.totalPage);

            });
        },

        // 設定倒數動畫
        setCountdownAnimation(){
            const countDownAnimation = [
                { width: "100%" },
                { width: "0%" }
            ];
            const countDownTiming = {
                duration: this.time,
                iterations: 1,
            }

            const countdownLine = document.getElementById('countdownLineForMachineDetail');
            countdownLine.animate(countDownAnimation, countDownTiming);
        },

        // 設定單頁呈現資料
        getShowData(){
            this.showList = [];
            let startIndex = 0 + ( this.pageNow -1 ) * this.high;
            let largestIndex = this.high + ( this.pageNow -1 ) * this.high;
            let endIndex = largestIndex > this.dataList.length? this.dataList.length : largestIndex;
            for(startIndex; startIndex < endIndex; startIndex++){
                this.showList.push(this.dataList[startIndex]);
            }
        },

        // 停止計時器
        stopTimer(){
            clearTimeout(this.timerForNewStatus);
            this.timerForNewStatus = null;
        },

        // 檢視機台詳細資料
        checkMachineDetail(item){
            this.machineDetail = item;
            this.$emit('sendMachineDetail', this.machineDetail)
        },

        // 換頁
        changePage(page){
            if (page === this.pageNow){
                return;
            }
            this.pageNow = page;
            this.getShowData();
        }
        
    },

    data(){
        return{

            // 常數管理
            high: 8,       // 單頁最多筆數 
            time: 10000,    // 多久更新資料(ms)

            // 資料管理
            dataList: [],   // 所有資料清單

            // 畫面呈現
            totalPage: 0,     // 總頁數
            pageNow: 0,       // 現在頁面
            showList: [],     // 現在頁面的資料清單
            updateTime: null,   // 資料更新時間
            machineDetail:{},   // 現在查看的資料詳細

            // 計時器
            timerForNewStatus: null,  // 定時取資料
        }
    }
}
</script>

<template>
    <div class="machineStatus">

        <div class="table">
            <p v-if="!this.dataList.length" style="font-size: 1vw">暫無資料</p>
            <table v-if="this.dataList.length">
                <thead>
                    <tr class="detail">
                        <th scope="col" class="machineNumber">名稱</th>
                        <th scope="col" class="status">狀態</th>
                        <th scope="col" class="type">種類</th>
                        <th scope="col" class="order">處理單號</th>
                        <th scope="col" class="produce">產量</th>
                        <th scope="col" class="produce">良率</th>
                        <th scope="col" class="updateTime">最後接收時間</th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr class="content" :class="item.status" v-for="item in this.showList" @click="checkMachineDetail(item)">
                        <td>{{ item.name }}</td>
                        <td class="status">{{ item.status }}</td>
                        <td class="type">{{ item.type }}</td>
                        <td>{{ item.orderNumber }}</td>
                        <td>{{ item.pass }}</td>
                        <td>{{ Math.round(item.pass / (item.pass+item.ng)*1000)/1000*100 }}%</td>
                        <td>{{ item.time.toString().substring(5, 10) + " " + item.time.toString().substring(11) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="button">
            <button :class="{ 'now': this.pageNow === i }" v-for="i in this.totalPage" @click="changePage(i)">{{ i }}</button>
        </div>        


        <div class="note">
            <div id="countdownLineForMachineDetail"></div>
            <table>
                <tr class="countdown">
                    <th scope="row" class="renewTime">更新時間：{{ this.updateTime }}</th>
                    <th scope="row" class="dataCount" v-if="this.dataList.length"> ( 共 {{ this.dataList.length }} 筆 ) </th>
                    <th scope="row" class="dataCount" v-if="!this.dataList.length"> ( 共 - 筆 ) </th>
                </tr>
            </table>
        </div>
    
    </div>

</template>

<style lang="scss" scoped>

    // 基本樣式
    .machineStatus {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .table{
            // border: 1px solid black;
            height: 84%;
            border-bottom: 1px solid #f2f2f2;

            table{
                border-collapse: collapse;

                thead{
                    .detail{
                        th{
                            font-size: 0.9vw;
                            text-align: center;
                            border-bottom: 1vh solid white;
                        }
                        .machineNumber{
                            width: 14vw;
                        }
                        .status{
                            width: 12vw;
                        }
                        .type{
                            width: 12vw;
                        }
                        .order{
                            width: 12vw;
                        }
                        .produce{
                            width: 12vw;
                        }
                        .updateTime{
                            width: 18.8vw;
                        }
                    }
                }

                tbody{
                    tr{
                        border: 0;
                    }

                    tr:nth-child(odd){
                        background-color: #f2f2f2;
                        border: 0;
                    }

                    .content{
                        height: 70%;
                        .type{
                            font-size: 0.9vw;
                        }
                        td{
                            height: 4vh;

                            word-wrap: break-word;
                            vertical-align: center;
                            text-align: center;
                            font-size: 1.1vw;
                        }
                    }
                }
            }
        }
        
        .button{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 10%;
            // border:1px solid #5E5E5E;
            button{
                margin-left: 0.3vw;
                margin-right: 0.3vw;
                display: block;
                width: 1vw;
                height: 1vw;
                background-color: white;
                cursor: pointer;
                // border: 1px solid #5E5E5E;
                border-radius: 50%;

                font-size: 0.8vw;
            }

        }

        .note{
            #countdownLineForMachineDetail{
                width: 100%;
                height: 0.5vh;
                background-color: var(--yellowLight);
            }

            table{
                border-collapse: collapse;
                
                .countdown{
                    border: 0;
                    th{
                        background-color: var(--yellow);
                        width: 46.5vw;

                        font-weight: 600;
                        font-size: 0.95vw;
                        vertical-align: top;
                    }
                    .renewTime{
                        border-radius: 0px 0px 0px 10px;
                        padding-left: 2vw;
                        text-align: left; 
                    }
                    .dataCount{
                        border-radius: 0px 0px 10px 0px;
                        padding-right: 2vw;
                        text-align: right;
                    }
                }
            }
        }

    }

    // 特殊樣式：按鈕-現在頁面
    .machineStatus{
        .button{
            .now{
                background-color: var(--yellow);
                color: white;
            }
        }
    }

    // 特殊樣式：機台狀態
    .idle{
        .status{
            background-color: var(--blueLight);
        }
    }
    .run{
        .status{
            background-color: var(--greenLight);
        }
    }
    .error{
        .status{
            background-color: var(--redLight);
        }
    }


</style>
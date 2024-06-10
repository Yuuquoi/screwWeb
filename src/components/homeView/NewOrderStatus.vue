<script>
export default{

    // lifecycle
    mounted(){
        // 抓取資料
        this.getNewestData();
    },
    beforeUnmount(){
        // 停止計時器
        this.stopTimer();
    },

    methods: {
        // 抓取資料庫新資料
        getNewestData(){

            // 設定更新時間
            const now = new Date();
            this.refTime = Date.now();
            this.updateTime = now.getMonth().toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') + ' ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            // 初始化
            this.dataList = [];
            this.showList = [];
            this.totalPage = 0;
            this.pageNow = 0;
            this.finishList = [];
            this.finishNotify = [];

            // 進入資料庫
            fetch("http://localhost:8080/screw/orderDataDay",{
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

                if(!data.orderAndMachineList){
                    return;
                }

                // 設定顯示資料
                this.totalPage = Math.ceil( data.orderAndMachineList.length / this.high );
                for(let index in data.orderAndMachineList){
                    this.dataList.push(data.orderAndMachineList[index]);
                }
                
                // 設定單頁呈現資料
                this.getShowData();

                // 設定翻頁時間
                this.stopTimer();

                this.timerForNextPage = setInterval(() => {
                        setTimeout(this.getShowData(), 0)
                    }, this.time*this.totalPage);

            });
        },

        // index 轉換成所在頁數
        turnIntoPage(index){
            for(let i = 1; i <= this.totalPage; i++){
                if( index < this.high * i){
                    return i;
                }
            }
        },

        // 設定倒數動畫
        setCountdownAnimation(){
            const countDownAnimation = [
                { width: "100%" },
                { width: "0%" }
            ];
            const countDownTiming = {
                duration: this.totalPage * this.time,
                iterations: 1,
            }

            const countdownLine = document.getElementById('countdownLineForOrderStatus');
            countdownLine.animate(countDownAnimation, countDownTiming);
        },

        // 設定單頁呈現資料
        getShowData(){
            this.pageNow ++;
            
            // 設定倒數動畫
            this.setCountdownAnimation();

            // 若已翻到最後一頁
            if( this.pageNow > this.totalPage){
                this.getNewestData();
                return;
            }

            this.showList = [];
            let startIndex = 0 + ( this.pageNow -1 ) * this.high;
            let largestIndex = this.high + ( this.pageNow -1 ) * this.high;
            let endIndex = largestIndex > this.dataList.length? this.dataList.length : largestIndex;
            for(startIndex; startIndex < endIndex; startIndex++){
                this.showList.push(this.dataList[startIndex]);
            }
        },

        // 通知錯誤訊息
        alarm(){

            // 畫面通知
            let msg = '';
            for(let index in this.finishNotify){
                if(!msg){
                    msg = '訂單編號：' + this.finishNotify[index].orderNumber + ' 機台名稱：' + this.finishNotify[index].name;
                }
                msg += '\n' + '訂單編號：' + this.finishNotify[index].orderNumber + ' 機台名稱：' + this.finishNotify[index].name;
            }

            Swal.fire({
                title: "訂單即將完成",
                html: msg,
                timer: 5000,
                timerProgressBar: true,
                icon: "success"
            });
        },

        // 停止計時器
        stopTimer(){
            window.clearInterval(this.timerForNextPage);
            this.timerForNextPage = null;
        },

    },
    
    data(){
        return{
            // 常數管理
            high: 8,       // 單頁最多筆數 
            time: 10000,    // 每頁停留時間(ms)

            // 資料管理
            dataList: [],   // 所有資料清單

            // 畫面呈現
            totalPage: 0,     // 總頁數
            pageNow: 0,       // 現在頁面
            showList: [],     // 現在頁面的資料清單
            finishList: [],    // error狀態的索引位置
            finishNotify: [],  // 要子傳父的 error 機台資料
            updateTime: null,   // 資料更新時間

            // 數值計算
            refTime: null,
            
            // 計時器
            timerForNextPage: null,  // 定時換頁
        }
    }
}
</script>

<template>
    <div class="orderStatus">

        <p class="title">單號最新資訊</p>

        <div class="table">
            <p v-if="!this.dataList.length" style="font-size: 1vw">暫無資料</p>

            <table v-if="this.dataList.length">

                <thead>
                    <tr class="detail">
                        <th scope="col" class="orderNumber">訂單編號</th>
                        <th scope="col" class="aim">目標產量</th>
                        <th scope="col" class="machineType">種類</th>
                        <th scope="col" class="sofar">累積產量</th>
                        <th scope="col" class="finishRatio">完成率</th>
                        <th scope="col" class="estimateFinishTime">預估完成時間</th>
                        <th scope="col" class="updateTime">最後接收時間</th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="content" v-for="item in this.showList">
                        <td>{{ item.orderNumber }}</td>
                        <td>{{ item.aim }}</td>
                        <td class="machineType">{{ item.type }}</td>
                        <td>{{ item.pass }}</td>
                        <td>{{ Math.round(item.pass / item.aim *1000)/1000 }}%</td>
                        <td>{{ item.finishTime.toString().substring(5, 10) + " " + item.finishTime.toString().substring(11, 16) }}</td>
                        <td>{{ item.updateTime.toString().substring(5, 10) + " " + item.updateTime.toString().substring(11, 19) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="note">
            <div id="countdownLineForOrderStatus"></div>
            <table>
                <tr class="countdown">
                    <th scope="row" class="renewTime">更新時間：{{ this.updateTime }}</th>
                    <th scope="row" class="dataCount" v-if="this.dataList.length"> ( 共 {{ this.dataList.length }} 筆 ) </th>
                    <th scope="row" class="dataCount" v-if="!this.dataList.length"> ( 共 - 筆 ) </th>
                </tr>
            </table>
        </div>

        <div class="button" v-if="this.dataList.length">
            <button :class="{ 'LessThanTenMin': this.finishList.includes(i) , 'now': this.pageNow === i}" v-for="i in this.totalPage"></button>
        </div>

    </div>
</template>

<style lang="scss" scoped>

    // 基本樣式
    .orderStatus {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .title{
            width: 100%;
            height: 1.5vw;
            background-color: var(--green);
            border-radius: 10px 10px 0px 0px ;
            margin-bottom: 1vh;

            color: white;
            text-align: center;
            line-height: 1.6vw;
            font-size: 0.95vw;
        }

        .table{
            height: 36vh;
            // border: 1px solid black;
            table{
                border-collapse: collapse;
                thead{
                    .detail{
                        th{
                            font-size: 0.9vw;
                            text-align: center;
                            border-bottom: 1vh solid white;
                        }
                        .orderNumber{
                            width: 6vw;
                        }
                        .aim{
                            width: 8vw;
                        }
                        .machineNumber{
                            width: 6vw;
                        }
                        .machineType{
                            width: 6vw;
                        }
                        .sofar{
                            width: 6.5vw;
                        }
                        .finishRatio{
                            width: 8vw;
                        }
                        .estimateFinishTime{
                            width: 10vw;
                        }
                        .updateTime{
                            width: 10vw;
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
                        height: 10%;
                        .machineType{
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
        
        .note{
            #countdownLineForOrderStatus{
                width: 100%;
                height: 0.5vh;
                background-color: var(--greenLight);
            }

            table{
                border-collapse: collapse;
                
                .countdown{
                    border: 0;
                    th{
                        background-color: var(--green);
                        width: 27.25vw;

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

        .button{
            display: flex;
            justify-content: center;
            button{
                margin-left: 0.2vw;
                margin-right: 0.2vw;
                margin-top: 0.8vw;
                display: block;
                width: 0.5vw;
                height: 0.5vw;
                background-color: white;
                border: 1px solid #5E5E5E;
                border-radius: 50%;
            }

        }
    }

    // 特殊樣式：按鈕-錯誤頁面
    .orderStatus{
        .button{
            .LessThanTenMin{
                border-color: var(--red);
                animation: finishAlarm 1.5s ease 0s infinite alternate;
            }
        }
    }

    // 特殊樣式：按鈕-現在頁面
    .orderStatus{
        .button{
            .now{
                background-color: #5E5E5E;
            }
        }
    }

    // 特殊樣式：機台狀態
    .LessThanToday{
        .status{
            background-color: var(--blueLight);
        }
    }
    .LessThanOneHour{
        .status{
            background-color: var(--yellowLight);
        }
    }
    .LessThanTenMin{
        td{
            animation: finishAlarm 1.5s ease 0s infinite alternate;  
            background-color: var(--greenLight);
        }
        .status{
            background-color: var(--greenLight);
        }
    }

    @keyframes finishAlarm{
        0% { 
            background-color: white;
        }
        50%{ 
            background-color: var(--greenLight); 
        }
        70%{ 
            background-color: white;
        }
        100%{ 
            background-color: var(--greenLight); 
        }
    }

</style>
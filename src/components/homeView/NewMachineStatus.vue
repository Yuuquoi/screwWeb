<script>
import Swal from 'sweetalert2'

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

    //
    methods: {
        // 抓取資料庫新資料
        getNewestData(){

            // 設定更新時間
            const now = new Date();
            this.updateTime = now.getMonth().toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') + ' ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            // 初始化
            this.dataList = [];
            this.showList = [];
            this.totalPage = 0;
            this.pageNow = 0;
            this.errorList = [],
            this.errorNotify = [];

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
                    this.dataList = [];
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
                
                // 設定單頁呈現資料
                this.getShowData();
                
                // 若有 error 發送通知
                if(this.errorNotify.length){
                    this.$emit('machineAlarm', this.errorNotify);
                    this.alarm();
                } else {
                    this.$emit('machineAlarm', []);
                }

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

            const countdownLine = document.getElementById('countdownLineForMachineStatus');
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
            for(let index in this.errorNotify){
                if(!msg){
                    msg = this.errorNotify[index];
                } else {
                    msg += '\n' + this.errorNotify[index];
                }
            }

            Swal.fire({
                title: "機台異常",
                html: msg,
                timer: 5000,
                timerProgressBar: true,
                icon: "error"
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
            high: 19,       // 單頁最多筆數 
            time: 10000,    // 每頁停留時間(ms)

            // 資料管理
            dataList: [],   // 所有資料清單

            // 畫面呈現
            totalPage: 0,     // 總頁數
            pageNow: 0,       // 現在頁面
            showList: [],     // 現在頁面的資料清單
            errorList: [],    // error狀態的索引位置
            errorNotify: [],  // 要子傳父的 error 機台資料
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
    <div class="machineStatus">

        <p class="title">機台最新資訊</p>

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
                        <th scope="col" class="updateTime">最後接收時間</th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr class="content" :class="item.status" v-for="item in this.showList">
                        <td>{{ item.name }}</td>
                        <td class="status">{{ item.status }}</td>
                        <td class="type">{{ item.type }}</td>
                        <td v-if="!item.orderNumber">-</td>
                        <td v-if="item.orderNumber">{{ item.orderNumber }}</td>
                        <td>{{ item.pass }}</td>
                        <td>{{ item.time.toString().substring(5, 10) + " " + item.time.toString().substring(11) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="note">
            <div id="countdownLineForMachineStatus"></div>
            <table>
                <tr class="countdown">
                    <th scope="row" class="renewTime">更新時間：{{ this.updateTime }}</th>
                    <th scope="row" class="dataCount" v-if="this.dataList.length"> ( 共 {{ this.dataList.length }} 筆 ) </th>
                    <th scope="row" class="dataCount" v-if="!this.dataList.length"> ( 共 - 筆 ) </th>
                </tr>
            </table>
        </div>

        <div class="button" v-if="this.dataList.length">
            <button :class="{ 'error': this.errorList.includes(i) , 'now': this.pageNow === i}" v-for="i in this.totalPage"></button>
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

        .title{
            width: 100%;
            height: 1.5vw;
            background-color: var(--yellow);
            border-radius: 10px 10px 0px 0px ;
            margin-bottom: 1vh;

            color: white;
            text-align: center;
            line-height: 1.6vw;
            font-size: 0.95vw;
        }

        .table{
            // border: 1px solid black;
            height: 79vh;
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
                            width: 6vw;
                        }
                        .status{
                            width: 4vw;
                        }
                        .type{
                            width: 5.8vw;
                        }
                        .order{
                            width: 4vw;
                        }
                        .produce{
                            width: 6vw;
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
        
        .note{
            #countdownLineForMachineStatus{
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
                        width: 17.48vw;

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
    .machineStatus{
        .button{
            .error{
                border-color: var(--red);
                animation: errorAlarm 1.5s ease 0s infinite alternate;
            }
        }
    }

    // 特殊樣式：按鈕-現在頁面
    .machineStatus{
        .button{
            .now{
                background-color: #5E5E5E;
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
        td{
            animation: errorAlarm 1.5s ease 0s infinite alternate;  
            background-color: var(--redLight);
        }
        .status{
            background-color: var(--redLight);
        }
    }

    @keyframes errorAlarm{
        0% { 
            background-color: white;
        }
        50%{ 
            background-color: var(--redLight); 
        }
        70%{ 
            background-color: white;
        }
        100%{ 
            background-color: var(--redLight); 
        }
    }

</style>
<script>
import { useChartStore } from '../../stores/chart.js';

export default{

    mounted() {
        // 取得時間
        this.getTime();
        this.timerForLocalDateTime = setInterval(() => {
                setTimeout(this.getTime(), 0)
            }, 1000);

        // 取得圖表資料
        this.fetchChartData();
        this.timerForSum = setInterval(() => {
                setTimeout(this.fetchChartData(), 0)
            }, 86400000);
    },

    methods: {
        // 獲得現在時間
        getTime(){
            let date = new Date();
            this.date[0] = date.getFullYear().toString();
            this.date[1] = (date.getMonth()+1).toString().padStart(2, '0');
            this.date[2] = date.getDate().toString().padStart(2, '0');
            switch (date.getDay()) {
                case 0:
                this.date[3] = "日";
                    break;            
                case 1:
                this.date[3] = "一";
                    break;            
                case 2:
                this.date[3] = "二";
                    break;            
                case 3:
                this.date[3] = "三";
                    break;            
                case 4:
                this.date[3] = "四";
                    break;            
                case 5:
                this.date[3] = "五";
                    break;            
                case 6:
                this.date[3] = "六";
            }
            this.date[4] = date.getHours().toString().padStart(2, '0');
            this.date[5] = date.getMinutes().toString().padStart(2, '0');
            this.date[6] = date.getSeconds().toString().padStart(2, '0');
        },

        // 抓取圖表資料
        fetchChartData(){

            let label = [];
            let data0 = [];
            let data1 = [];
            let data2 = [];
            let data3 = [];
            let data4 = [];
            let doughnutLabel = ["伸線機", "成型機", "打頭機", "淬火爐", "電鍍機"];
            let totalPower = [0, 0, 0, 0, 0];
            let totalProduce = [0, 0, 0, 0, 0];
            for(let index = 0; index < 24; index++){
                label[index] = index;
                data0[index] = 0;
                data1[index] = 0;
                data2[index] = 0;
                data3[index] = 0;
                data4[index] = 0;
            }

            const now = new Date();
            this.updateTime = now.getMonth().toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') + ' ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            fetch("http://localhost:8080/screw/machineHoursData",{
            method: 'GET',
            headers:{
                "Content-Type":"application/json"
            },
            })
            .then(res => res.json())
            .then((data) => {
                if(data.code != 200){
                    console.log(data);
                    return;
                }                
                console.log(data);
                for(let index in data.equipmentHoursDayList){
                    switch (data.equipmentHoursDayList[index].type) {
                        case doughnutLabel[0]:
                            data0[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;
                            totalPower[0] += data.equipmentHoursDayList[index].power;
                            totalProduce[0] += data.equipmentHoursDayList[index].pass;
                            console.log(data0);
                            console.log(totalPower);
                            break;
                        case doughnutLabel[1]:
                            data1[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;                        
                            totalPower[1] += data.equipmentHoursDayList[index].power;
                            totalProduce[1] += data.equipmentHoursDayList[index].pass;
                            break;
                        case doughnutLabel[2]:
                            data2[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;                                                    
                            totalPower[2] += data.equipmentHoursDayList[index].power;
                            totalProduce[2] += data.equipmentHoursDayList[index].pass;
                            break;                    
                        case doughnutLabel[3]:
                            data3[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;                                                    
                            totalPower[3] += data.equipmentHoursDayList[index].power;
                            totalProduce[3] += data.equipmentHoursDayList[index].pass;
                            break;                    
                        case doughnutLabel[4]:
                            data4[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;                                                    
                            totalPower[4] += data.equipmentHoursDayList[index].power;
                            totalProduce[4] += data.equipmentHoursDayList[index].pass;
                            break;                    
                    }                    
                }
                fetch("http://localhost:8080/screw/machineNewHourData",{
                    method: 'GET',
                    headers:{
                        "Content-Type":"application/json"
                    },
                })
                .then(res => res.json())
                .then((data) => {
                    if(data.code != 200){
                        console.log(data);
                    } else {
                        console.log(data.equipmentHourList);
                        for(let index in data.equipmentHourList){
                            console.log(data.equipmentHourList[index].pass);
                            switch (data.equipmentHourList[index].type) {
                                case doughnutLabel[0]:
                                    data0[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;
                                    totalPower[0] += data.equipmentHoursDayList[index].power;
                                    totalProduce[0] += data.equipmentHoursDayList[index].pass;
                                    break;
                                case doughnutLabel[1]:
                                    data1[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;      
                                    totalPower[1] += data.equipmentHoursDayList[index].power;
                                    totalProduce[1] += data.equipmentHoursDayList[index].pass;
                                    break;
                                case doughnutLabel[2]:
                                    data2[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;   
                                    totalPower[2] += data.equipmentHoursDayList[index].power;
                                    totalProduce[2] += data.equipmentHoursDayList[index].pass;
                                    break;
                                case doughnutLabel[3]:
                                    data3[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;   
                                    totalPower[3] += data.equipmentHoursDayList[index].power;
                                    totalProduce[3] += data.equipmentHoursDayList[index].pass;
                                    break;
                                case doughnutLabel[4]:
                                    data4[parseInt(data.equipmentHoursDayList[index].time.substring(11,13))] = data.equipmentHoursDayList[index].pass;   
                                    totalPower[4] += data.equipmentHoursDayList[index].power;
                                    totalProduce[4] += data.equipmentHoursDayList[index].pass;
                                    break;}               
                        }
                    }
                const chartService = useChartStore();
                let datasets = [{label: '伸線機', data: data0}, {label: '成型機', data: data1}, {label: '打頭機', data: data2}, {label: '淬火爐', data: data3}, {label: '電鍍機', data: data4}]
                chartService.stackChart("stackedChartID", label, datasets);
                this.sumPower = totalPower[0] + totalPower[1] + totalPower[2] + totalPower[3] + totalPower[4];
                chartService.doughnutChart("totalPower", doughnutLabel, totalPower);
                this.sumProduce = totalProduce[0] + totalProduce[1] + totalProduce[2] + totalProduce[3] + totalProduce[4];
                chartService.doughnutChart("totalProduce", doughnutLabel, totalProduce);

                // 設定倒數動畫
                this.setCountdownAnimation();

            });

            });
        },

        // 設定倒數動畫
        setCountdownAnimation(){
            const countDownAnimation = [
                { width: "100%" },
                { width: "0%" }
            ];
            const countDownTiming = {
                duration: 60000,
                iterations: 1,
            }

            const countdownLine = document.getElementById('countdownLineForDayAccumulation');
            countdownLine.animate(countDownAnimation, countDownTiming);
        },

    },
    data(){
        return{
            // 紀錄現在時間 : 0年 1月 2日 3星期 4時 5分 6秒
            date:[],

            // 讀取時間的計時器
            timerForLocalDateTime: null,
            
            // 統計結果
            timerForSum: null,
            sumPower: 0,
            sumProduce: 0,
            updateTime: null,
        }
    }
}
</script>

<template>
    <div class="todayBlock">
    
        <p class="title">今日累積數值</p>
    
        <div class="content">
    
            <div class="left">
                <div class="clock">
                    <P class="date">
                        {{ this.date[0] }} 年 {{ this.date[1] }} 月 {{ this.date[2] }} 日
                    </P>
                    <P class="week">
                        星期{{ this.date[3] }}
                    </P>
                    <P class="time">
                        {{ this.date[4] }}:{{ this.date[5] }}:{{ this.date[6] }}
                    </P>
                </div>
            </div>

            <div class="center">
                <p>生產趨勢</p>
                <canvas id="stackedChartID"></canvas>
            </div>
    
            <div class="right">
                <div class="explain">
                    <p class="totalPower">累積電量
                        <p><span style='font-weight: 600'>{{ Math.round(this.sumPower) }}</span><br>瓦</p>
                    </p>
                    <p class="totalProduce">累積產量
                        <p><span style='font-weight: 600'>{{ this.sumProduce }}</span><br>顆</p>
                    </p>
                </div>

                <div class="chart">
                    <canvas id="totalPower"></canvas>
                    <canvas id="totalProduce"></canvas>
                </div>
            </div>
        </div>

        <div class="note">
            <div id="countdownLineForDayAccumulation"></div>
            <table>
                <tr class="countdown">
                    <th scope="row" class="renewTime">更新時間：{{ this.updateTime }}</th>
                    <th scope="row" class="dataCount"></th>
                </tr>
            </table>
        </div>

    </div>
</template>

<style lang="scss" scoped>

    // 基本樣式
    .todayBlock{
        width: 100%;
        height: 100%;

        .title{
            width: 100%;
            height: 1.5vw;
            background-color: var(--red);
            border-radius: 10px 10px 0px 0px ;
            margin-bottom: 1vh;

            color: white;
            text-align: center;
            line-height: 1.6vw;
            font-size: 0.95vw;
        }
        
        .content{
            display: flex;
            height: 32.8vh;
            padding: 1.2vw;

            .left{
                padding-top: 2vw;
                padding-right: 1vw;
                border-right: 1px solid #5E5E5E;
                margin-right: 1vw;
                .clock{
                    width: 10vw;
                    .date{
                        height: 1.5vw;
                        font-size: 1vw;
                        text-align: center;
                    }
                   .week{
                        height: 1.5vw;
                        font-size: 1vw;
                        text-align: center;
                        margin-bottom: 2vw;
                    }
                    .time{
                        height: 1.8vw;
                        font-size: 1.9vw;
                        text-align: center;
                    }
                }
            }

            .center{
                width: 48%;
                border-right: 1px solid #5E5E5E;
                p{
                    font-size: 0.9vw;
                    text-align: center;
                }
                canvas{
                    width: 92%;
                }
            }

            .right{
                width: 29%;
                display: flex;
                padding-left: 1vw;
                .explain{
                    width: 30%;
                    text-align: center;
                    .totalPower{
                        margin-top: 3.2vw;
                    }
                    .totalProduce{
                        margin-top: 5.8vw;
                    }
                    p{
                        position: relative;
                        font-size: 0.9vw;
                        p{
                            width: 5vw;
                            font-size: 0.8vw;
                            position: absolute;
                            z-index: 2;
                            left: 162%;
                            top: 0;
                            text-align: center;
                            span{
                                font-size: 0.8vw;
                            }
                        }
                    }
                }
                .chart{
                    width: 70%;
                    canvas{
                        margin-top: 1vw;
                        margin-bottom: 1vw;
                    }
                }
            }

        }

        .note{
            #countdownLineForDayAccumulation{
                width: 100%;
                height: 0.5vh;
                background-color: var(--redLight);
            }

            table{
                border-collapse: collapse;
                
                .countdown{
                    border: 0;
                    th{
                        background-color: var(--red);
                        width: 66vw;

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

</style>
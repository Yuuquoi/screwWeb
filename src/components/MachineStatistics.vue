<script>
import * as echarts from 'echarts/core';
import {
    DatasetComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components';

import {
    BarChart,
    LineChart
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import VChart, { THEME_KEY } from 'vue-echarts';

echarts.use([
    DatasetComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer,
    LineChart,
    UniversalTransition
]);
export default {
    data() {
        return {
            week: "",
            list:[],
            dataRunAvg:0.0,
            dataIdleAvg:0.0,
            dataErrorAvg:0.0,
            statusAvgSum:0.0,
            dataCurrentAvg:0.0,
            dataPassAvg:0.0,
            option1: {
                legend: {
                    top: '3%',
                },
                tooltip: {
                    
                },
                dataset: {
                    source: [
                        ['status', 'run', 'idle', 'error'],
                        ["這是周", '11', '22', '33'],
                        

                    ]
                },
                xAxis: { type: 'category',},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                {
                    type: 'bar',
                    // 此系列自己的调色盘。
                    color: [
                        '#9ADE7B',
                    ]

                },
                {
                    type: 'bar',
                    // 此系列自己的调色盘。
                    color: [
                        '#6895D2',
                    ]

                },
                {
                    type: 'bar',
                    // 此系列自己的调色盘。
                    color: [
                        '#FF8F8F',
                    ]

                }
                ]
            },
            option2: {
                legend: {
                    top: '3%',
                },
                tooltip: {
                    
                },
                dataset: {
                    source: [
                        ['status', '平均電流', ],
                        ["這是周", '11'],
                    ]
                },
                xAxis: { type: 'category',},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                {
                    type: 'bar',
                    barWidth: '25%',
                    // 此系列自己的调色盘。
                    color: [
                        '#F3CA52',
                    ]

                },
                
                ]
            },
            option3: {
                legend: {
                    top: '3%',
                },
                tooltip: {
                    
                },
                dataset: {
                    source: [
                        ['status', '平均良率'],
                        ["這是周", '11'],
                        
                    ]
                },
                xAxis: { type: 'category',},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                {
                    type: 'bar',
                    barWidth: '25%',
                    // 此系列自己的调色盘。
                    color: [
                        '#7ABA78',
                    ]

                },
                
                ]
            }
        }
    },
    props: [
        "mName",

    ],
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'light',
    },
    methods: {
        statusDataWeek() {
            let obj = {
                name: this.mName
            }
            fetch(`http://localhost:8080/screw/machineDataWeek?name=${this.mName}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    this.list.length = 0;
                    this.list.push(data);
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataRunAvg += item.dataRunAvg
                        this.dataIdleAvg += item.dataIdleAvg
                        this.dataErrorAvg += item.dataErrorAvg
                    });
                    //status 
                    this.statusAvgSum = this.dataRunAvg + this.dataIdleAvg + this.dataErrorAvg
                    this.dataRunAvg = Math.round(this.dataRunAvg/this.statusAvgSum*100)
                    this.dataIdleAvg = Math.round(this.dataIdleAvg/this.statusAvgSum*100)
                    this.dataErrorAvg = 100 - this.dataRunAvg - this.dataIdleAvg
                    this.option1.dataset.source[1][0] = this.week;
                    this.option1.dataset.source[1][1] = this.dataRunAvg
                    this.option1.dataset.source[1][2] = this.dataIdleAvg
                    this.option1.dataset.source[1][3] = this.dataErrorAvg

                    //current
                    this.dataCurrentAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataCurrentAvg += item.dataCurrentAvg
                        
                    });
                    this.dataCurrentAvg = this.dataCurrentAvg/this.list[0].equipmentList.length
                    this.option2.dataset.source[1][0] = this.week;
                    this.option2.dataset.source[1][1] = this.dataCurrentAvg.toFixed(6)
                    // console.log(this.dataCurrentAvg.toFixed(6))

                    // Production yield 
                    this.dataPassAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataPassAvg += item.dataPassAvg
                        
                    });
                    this.dataPassAvg = this.dataPassAvg/this.list[0].equipmentList.length*100
                    this.option3.dataset.source[1][0] = this.week;
                    this.option3.dataset.source[1][1] = this.dataPassAvg.toFixed(2)
                    // console.log(this.list[0].equipmentList)
                    
                })
        },
        statusDataMonth() {
            let obj = {
                name: this.mName
            }
            fetch(`http://localhost:8080/screw/machineDataMonth?name=${this.mName}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    this.list.length = 0;
                    this.list.push(data);
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataRunAvg += item.dataRunAvg
                        this.dataIdleAvg += item.dataIdleAvg
                        this.dataErrorAvg += item.dataErrorAvg
                    });
                    //status 
                    this.statusAvgSum = this.dataRunAvg + this.dataIdleAvg + this.dataErrorAvg
                    this.dataRunAvg = Math.round(this.dataRunAvg/this.statusAvgSum*100)
                    this.dataIdleAvg = Math.round(this.dataIdleAvg/this.statusAvgSum*100)
                    this.dataErrorAvg = 100 - this.dataRunAvg - this.dataIdleAvg
                    this.option1.dataset.source[1][0] = this.month
                    this.option1.dataset.source[1][1] = this.dataRunAvg
                    this.option1.dataset.source[1][2] = this.dataIdleAvg
                    this.option1.dataset.source[1][3] = this.dataErrorAvg

                    //current
                    this.dataCurrentAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataCurrentAvg += item.dataCurrentAvg
                        
                    });
                    this.dataCurrentAvg = this.dataCurrentAvg/this.list[0].equipmentList.length
                    this.option2.dataset.source[1][0] = this.month
                    this.option2.dataset.source[1][1] = this.dataCurrentAvg.toFixed(6)
                    // console.log(this.dataCurrentAvg.toFixed(6))

                    // Production yield 
                    this.dataPassAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataPassAvg += item.dataPassAvg
                        
                    });
                    this.dataPassAvg = this.dataPassAvg/this.list[0].equipmentList.length*100
                    this.option3.dataset.source[1][0] = this.month
                    this.option3.dataset.source[1][1] = this.dataPassAvg.toFixed(2)
                    // console.log(this.list[0].equipmentList)
                    
                })
        },
        statusDataYear() {
            let obj = {
                name: this.mName
            }
            fetch(`http://localhost:8080/screw/machineDataYear?name=${this.mName}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    this.list.length = 0;
                    this.list.push(data);
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataRunAvg += item.dataRunAvg
                        this.dataIdleAvg += item.dataIdleAvg
                        this.dataErrorAvg += item.dataErrorAvg
                    });
                    //status
                    this.statusAvgSum = this.dataRunAvg + this.dataIdleAvg + this.dataErrorAvg
                    this.dataRunAvg = Math.round(this.dataRunAvg/this.statusAvgSum*100)
                    this.dataIdleAvg = Math.round(this.dataIdleAvg/this.statusAvgSum*100)
                    this.dataErrorAvg = 100 - this.dataRunAvg - this.dataIdleAvg
                    this.option1.dataset.source[1][0] = this.year
                    this.option1.dataset.source[1][1] = this.dataRunAvg
                    this.option1.dataset.source[1][2] = this.dataIdleAvg
                    this.option1.dataset.source[1][3] = this.dataErrorAvg

                    //current
                    this.dataCurrentAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataCurrentAvg += item.dataCurrentAvg
                        
                    });
                    this.dataCurrentAvg = this.dataCurrentAvg/this.list[0].equipmentList.length
                    this.option2.dataset.source[1][0] = this.year
                    this.option2.dataset.source[1][1] = this.dataCurrentAvg.toFixed(6)
                    // console.log(this.dataCurrentAvg.toFixed(6))
                    
                    // Production yield 
                    this.dataPassAvg = 0.0
                    this.list[0].equipmentList.forEach((item,index) => {
                        this.dataPassAvg += item.dataPassAvg
                        
                    });
                    this.dataPassAvg = this.dataPassAvg/this.list[0].equipmentList.length*100
                    this.option3.dataset.source[1][0] = this.year
                    this.option3.dataset.source[1][1] = this.dataPassAvg.toFixed(2)
                    // console.log(this.list[0].equipmentList)
                    
                })
        },
    },
    mounted() {
        let dateLastWeek = new Date();
        dateLastWeek.setDate(dateLastWeek.getDate()-7);
        let dateLastMonth = new Date();
        dateLastMonth.setMonth(dateLastMonth.getMonth()-1);
        let dateLastYear = new Date();
        dateLastYear.setFullYear(dateLastYear.getFullYear()-1);
        let dateNow = new Date();

        this.week = dateLastWeek.getMonth().toString()+ '/' + dateLastWeek.getDate().toString() + "-" + dateNow.getMonth().toString() + '/' + dateNow.getDate().toString();
        this.month = dateLastMonth.getFullYear().toString() + '/' + dateLastMonth.getMonth().toString() + "-" + dateNow.getFullYear().toString() + '/' + dateNow.getMonth().toString();
        this.year = dateLastYear.getFullYear().toString() + '-' + dateNow.getFullYear().toString();4

        this.option1.dataset.source[1][0] = this.week;
        this.option2.dataset.source[1][0] = this.week;
        this.option3.dataset.source[1][0] = this.week;
    },
    updated() {
        
    },
}
</script>

<template>
    <div class="chartArea">
        <h2>{{this.mName}}</h2>
        <div class="block">
            <span class="title">狀態比例(%)　　</span>
            <span @click="this.statusDataWeek()" class="text">週</span>
            <span>　　</span>
            <span @click="this.statusDataMonth()" class="text">月</span>
            <span>　　</span>
            <span @click="this.statusDataYear()" class="text">年</span>
        </div>
        <v-chart class="chart" :option="this.option1" />

        <div class="block">
            <span class="title">平均電流(A)　　</span>
            <span @click="this.statusDataWeek()" class="text">週</span>
            <span>　　</span>
            <span @click="this.statusDataMonth()" class="text">月</span>
            <span>　　</span>
            <span @click="this.statusDataYear()" class="text">年</span>
        </div>
        <v-chart class="chartLine" :option="this.option2" />

        <div class="block">
            <span class="title">平均良率(%)　　</span>
            <span @click="this.statusDataWeek()" class="text">週</span>
            <span>　　</span>
            <span @click="this.statusDataMonth()" class="text">月</span>
            <span>　　</span>
            <span @click="this.statusDataYear()" class="text">年</span>
        </div>
        <v-chart class="chartLine last" :option="this.option3" />

    </div>
    

</template>

<style lang="scss" scoped>
.chartArea {
    // text-align: center;
    width: 100%;
    height: 150vh;
    // position: relative;
    // border: 1px solid black;
    margin-top: 2vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 2vw;
    .block{
        // border: 1px solid black;
        width: 50%;
        height: 2.5%;
        // background: rgb(242, 242, 242);
        .title{
            font-size: 1vw;
        }
        .text{
            cursor: pointer;
            display: inline-block;
            text-align: center;
            font-size: 0.8vw;
            &:hover{
                width: 10%;
                background: rgb(220, 220, 220);
            }
        }
    }


    .chart {
        width: 90%;
        height: 25%;
        background: rgb(249, 248, 248);
        // .canvas{
        //     height: 20%;
        // }
    }

    .chartLine {
        width: 90%;
        height: 25%;
        // .canvas{
        //     height: 20%;
        // }
        background: rgb(249, 248, 248);
    }

}

.last{
    margin-bottom: 2vw;
}
</style>
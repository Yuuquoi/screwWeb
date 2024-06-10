
<script>
import List from '../components/statusMachine/List.vue'
import ListShow from '../components/statusMachine/ListShow.vue'

export default {

    methods: {
        // 抓取資料庫新資料
        getNewestData(machineName){

            // 進入資料庫
            fetch("http://localhost:8080/screw/findMachines",{
                method: 'POST',
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

                if(!data.machineNameList){
                    return;
                }

                for( let index in data.machineNameList){
                    if(data.machineNameList[index].name === machineName){
                        this.dataShow2 = data.machineNameList[index]
                    }
                }

            });
        },

        getPage3Data(machineName){

            // 進入資料庫
            fetch(`http://localhost:8080/screw/equipmentRecord?name=${machineName}`,{
                method: 'POST',
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

                if(!data.maintenanceList){
                    return;
                }

                this.dataShow3 = data.maintenanceList;
            });

        },

        // 取得即時資料
        getData1(name){
            
            // 進入資料庫
            fetch(`http://localhost:8080/screw/machineDayData?name=${name}`,{
                method: 'POST',
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

                if(!data.equipmentHourList){
                    return;
                }

                this.staticData1 = data.equipmentHourList;

            });
        },

        getData2(name){
            console.log();
            // 進入資料庫
            fetch(`http://localhost:8080/screw/machineWeekAvg?name=${name}`,{
                method: 'POST',
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

                if(!data.equipmentWeek){
                    return;
                    }
                this.staticData2.startTime = data.startTime.toString().substring(0,10);
                this.staticData2.endTime = data.endTime.toString().substring(0,10);
                this.staticData2.data = data.equipmentWeek;
            });

        },
        
        getData3(name){
            // 進入資料庫
            fetch(`http://localhost:8080/screw/recordStatistics?name=${name}`,{
                method: 'POST',
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

                if(!data.recordStatisticsList){
                    return;
                }
                this.staticData3 = data.recordStatisticsList;
            });

        },

        changeMode(){
            this.isList = !this.isList;
        },

        getDetail(detail){
            this.dataShow = detail;
            this.getNewestData(detail.name);
            this.getPage3Data(detail.name);
            this.getData1(detail.name);
            this.getData2(detail.name);
            this.getData3(detail.name);
        }
        
    },

    data() {
        return {
            isList: true,
            dataShow: null,
            dataShow2: null,
            dataShow3: null,
            staticData1: null,
            staticData2: {},
            staticData3: null,
        }
    },
    components: {
        List,
        ListShow
    },
}
</script>

<template>
    <div class="statusMachine">

        <div class="titleArea">
            <p class="title">機台詳細資訊</p>
            <!-- <button class="listBtn" :class="{ now : this.isList}" @click="changeMode">清單</button>
            <button class="displayBtn" :class="{ now : !this.isList}" @click="changeMode">布局</button> -->
        </div>

        <div class="listArea">
            <List @sendMachineDetail="getDetail" />
        </div>

        <div class="showArea">
            <ListShow :machineDetail="this.dataShow" :machineDetail2="this.dataShow2" 
            :machineDetail3="this.dataShow3"
             :staticData1="this.staticData1" :staticData2="this.staticData2" :staticData3="this.staticData3" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    // 基本樣式
    .statusMachine{
        width: 100%;
        height: 100%;
        
        .titleArea{
            width: 98%;
            height: 1.5vw;
            margin-top: 1%;
            margin-left: 1%;
            
            position: relative;

            .title{
                width: 100%;
                height: 100%;
                background-color: var(--yellow);
                border-radius: 10px 10px 0px 0px;
    
                color: white;
                text-align: center;
                line-height: 1.6vw;
                font-size: 0.95vw;
            }

            button{
                cursor: pointer;
                width: 4%;
                height: 100%;
                border: 2px solid var(--yellow);
                border-bottom: 2px solid var(--yellow);
                border-radius: 15px 5px 0px 0px;
                background-color: white;

                font-size: 1vw;
                color: #5E5E5E;
                line-height: 150%;

                position: absolute;
                top: 0%;
                left: 2%;
            }
            .displayBtn{
                left: 6%;
            }
        }
    }

    // 特殊樣式：正在瀏覽的分頁
    .statusMachine{
        .titleArea{
            .now{
                border-bottom: 2px solid white;
            }
        }
    }

    // 框架
    .statusMachine{
        
        .listArea{
            // border: 1px solid black;
            width: 98%;
            height: 42%;
            margin-top: 0.5%;
            margin-left: 1%;

        }

        .showArea{
            // border: 1px solid black;
            width: 98%;
            height: 48%;
            margin-top: 1%;
            margin-left: 1%;
        }

    }
</style>

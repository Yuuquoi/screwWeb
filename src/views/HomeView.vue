<script>
import NewMachineStatus from '../components/homeView/NewMachineStatus.vue'
import DayAccumulation from '../components/homeView/DayAccumulation.vue'
import NewOrderStatus from '../components/homeView/NewOrderStatus.vue'

export default {

    // lifecycle
    mounted() {
        // 播放公告
        this.timerForNextPage = setInterval(() => {
                setTimeout(this.announce(), 0)
            }, 10000);

    },
    beforeUnmount(){
        // 停止計時器
        this.stopTimer();
    },

    //
    methods: {
        // 接收機台要公告的資料
        alarmFromMachine(list){
            this.errorList = list;
            console.log(list);
        },

        // 播放公告
        announce(){
            if( !this.errorList.length ){
                return;
            }
            for(let index in this.errorList){
                this.errorText += this.errorList[index];
            }
        },

        // 停止計時器
        stopTimer(){
            clearTimeout(this.timerForRenew);
            this.timerForRenew = null;
        },

    },

    data() {
        return {

            // 常數管理
            time: 7000,

            // 畫面呈現
            errorList: [],
            errorText:"",
            errorListIndex: 0,
            finishListIndex: 0,
            
            // 計時器
            timerForRenew: null,
        }
    },

    components:{
        NewMachineStatus,
        DayAccumulation,
        NewOrderStatus,
    }
}
</script>

<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <div class="announcement">
        <i class="fa-solid fa-bullhorn"></i>
        <span id="announceText" v-if="!this.errorList.length"></span>
        <span id="announceText" v-if="this.errorList.length">【機台異常】機台：{{ this.errorList[0] }}狀態異常</span>
    </div>

    <div class="component">

        <div class="leftArea">
            <NewMachineStatus @machineAlarm="alarmFromMachine" />
        </div>
    
        <div class="rightArea">
            <div class="top">
                <DayAccumulation />
            </div>
            <div class="bottom">
                <NewOrderStatus />
            </div>
        </div>

    </div>
    
</template>

<style lang="scss" scoped>

    // 基本樣板
    .announcement{
        width: 100%;
        height: 4%;
        border-bottom: 1px solid #D4D4D1;
        margin-bottom: 2%;

        i{
            margin-left: 1vw;
            margin-right: 0.5vw;
            font-size: 1.2vw;
        }
        span{
            line-height: 160%;
            font-size: 1vw;
        }
    }

    // 框架
    .component{
        display: flex;

        .leftArea {
            width: 35vw;
            height: 89vh;
            margin-left: 1.8vw;
            margin-right: 1.8vw;
        }

        .rightArea {
            width: 54.5vw;
            height: 89vh;
            .top{
                width: 54.5vw;
                height: 40vh;
                margin-bottom: 3vh;
                // border: 1px solid black;
            }
            .bottom{
                width: 54.5vw;
                height: 46vh;
                // border: 1px solid black;
            }
        }
    }

</style>

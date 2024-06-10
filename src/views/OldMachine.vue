<script>
export default {
    data() {
        return {
            list: [],
            list2: [],
            list3: [],
            list4:[],
            machineNameList: [],
            addMachineName: "",
            deleteMachineName: [],
            voltage: 220,
        }
    },
    methods: {
        getMachineName() {
            let obj = {

            }
            fetch("http://localhost:8080/screw/findMachineName", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    this.list.length = 0;
                    this.machineNameList.length = 0;
                    this.list.push(data)
                    // console.log(this.list[0].machineNameList)
                    this.list[0].machineNameList.forEach((item, index) => {
                        this.machineNameList.push(item);
                    });

                    // console.log(this.machineNameList)
                })
        },
        addMachine() {
            let obj = {
                name: this.addMachineName
            }
            fetch(`http://localhost:8080/screw/addMachine?name=${this.addMachineName}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    this.list2.length = 0;
                    this.list2.push(data)
                    // console.log(this.list2)

                })
        },
        deleteMachine() {
            let obj = {
                machineName_list: this.deleteMachineName
            }
            fetch(`http://localhost:8080/screw/deleteMachine`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    // this.list3.length = 0;
                    // this.list3.push(data)
                    // console.log(this.deleteMachineName)
                    // console.log(this.list3)
                    // this.deleteMachineName.length = 0

                })


        },
        getVoltage(){
        let obj = {
            
        }
        fetch("http://localhost:8080/screw/getVoltage", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then((data) =>{
            this.list4.length = 0
            this.list4.push(data)
            this.voltage = this.list4[0].voltage
            // console.log(this.voltage)
            
        })
    },
        changeVoltage() {
            let obj = {
                data_run_avg: this.voltage
            }
            fetch(`http://localhost:8080/screw/updateVoltage?data_run_avg=${this.voltage}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then((data) => {
                    
                })
            console.log(this.voltage)
        }
    },
    beforeCreate() {
            if(!sessionStorage.getItem("account")){
                this.$router.push('/Login');
            }
        },
    mounted() {
        this.getMachineName()
        this. getVoltage()
    },
    updated() {
        this.getMachineName()
    },
}
</script>

<template>

<body>
    <div class="leftArea">
        <div class="machineStatus">
            <p class="title">機台管理</p>
            <div class="detail">
                <span class="machineNumber">機器編號</span>
                <span class="type">機種</span>
            </div>
    
            <!-- 最多可以 17 筆 -->
            <div class="content">
                <div class="item" :class="item.status" v-for="item in this.machineNameList">
                    <span class="machineNumber">{{ item.name }}</span>
                    <span class="type">{{ item.type }}</span>
                </div>
            </div>

        <div class="button">
            <button class="now" v-for="i in 1"></button>
            <span>( 共 {{ this.machineNameList.length }} 筆 )</span>
        </div>
        </div>
        <div class="addMachine" @click="this.addMachine()">新增</div>
    </div>

    <div class="rightArea">
        <p class="defaltText" v-if="this.mode === 0">點選左側列表操作</p>
    </div>

</body>

    <!-- <div class="content">
        <div class="leftArea">
            <div class="topArea">
                <h3>工廠基本設施</h3>
                <span>電壓(V)</span>
                <input type="number" v-model="this.voltage" @keydown="this. changeVoltage()">
            </div>

            <div class="bottomArea">
                <h3>設備管理</h3>
                <span>設備名稱</span>
                <div class="checkbox">
                    <div class="label">
                        <label for="" v-for="(item, index) in this.machineNameList">{{ item.name }}</label>
                    </div>
                    <div class="input">
                        <input type="checkbox" v-for="(item, index) in this.machineNameList" :value="item.name"
                            v-model="this.deleteMachineName" name="nameList">
                    </div>
                </div>
            </div>
        </div>
        <div class="rightArea">
            <input type="text" v-model="this.addMachineName">
            <p>　</p>
            <button type="button" @click="this.addMachine()">新增設備</button>

            <div class="delete">
                <button type="button" @click="this.deleteMachine()">刪除設備</button>
            </div>
        </div>
    </div> -->

</template>

<style lang="scss" scoped>
body{
    display: flex;
    width: 100%;
    .leftArea {
        width: 12.5%;
        margin-top: 2vw;
        margin-left: 2vw;
        margin-right: 2vw;
        .machineStatus {
            width: 100%;
            height: 88%;
            .title{
                background-color: var(--yellow);
            }
            .content{
                height: 75vh;
            }
        }
        .addMachine{
            margin-left: 2.8vw;
            font-size: 1vw;
            cursor: pointer;
            margin-top: 3vh;
            text-align: center;
            line-height: 2vw;
            color: var(--yellow);
            font-weight: 600;
            width: 50%;
            height: 2vw;
            border: 2px solid var(--yellow);
            border-radius: 10px;
            &:hover{
                background-color: #f6f4f4;
            }
        }
    }
}

.title{
    height: 1.5vw;
    color: white;
    text-align: center;
    line-height: 1.6vw;
    font-size: 0.95vw;
    border-radius: 5px;
    margin-bottom: 0.5vw;
}

.detail{
    span{
        display: inline-block;
        font-size: 0.9vw;
        text-align: center;
        padding-left: auto;
    }
}

.content {
    padding-top: 1.2vw;
    height: 10vh;
    border: 1px solid #5E5E5E;
    border-radius: 10px;
    .item{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 0.3vw;
        &:hover{
            cursor: pointer;
            &::after{
                content: "";
                width: 96%;
                height: 96%;
                position: absolute;
                left: 2%;
                top: 2%;
                border-radius: 15px;
                background-color: #eae8e8;
                z-index: -1;
            }
        }
        span{
            display: inline-block;
            font-size: 1.1vw;
            text-align: center;
            height: 2vw;
            line-height: 2vw;
        }
    }
}

.itemNow{
    &::after{
                content: "";
                width: 96%;
                height: 96%;
                position: absolute;
                left: 2%;
                top: 2%;
                border-radius: 15px;
                background-color: #eae8e8;
                z-index: -1;
            }
}

div{
    .machineNumber{
        width: 5vw;
        margin-left: 1.3vw;
    }
    .type{
        width: 5vw;
    }
    .status{
        width: 3.5vw;
        font-weight: 800;
    }
    .order{
        width: 3vw;
    }
    .produce{
        width: 3vw;
    }
    .updateTime{
        width: 7.7vw;
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
    span{
        margin-left: 0.5vw;
        line-height: 2vw;
        font-size: 0.8vw;
    }
    .error{
        border-color: var(--red);
        -webkit-animation-name: errorAlarm;
        -webkit-animation-duration: 1.5s;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-direction: alternate;
        -webkit-animation-timing-function: ease;
        -webkit-animation-play-state: running;
    }
    .now{
        background-color: #5E5E5E;
    }
}

.rightArea{
    height: 100vh;
    width: 84%;
    border: 1px solid black;
    overflow-x: hidden;
    overflow-y: scroll;
    p{
        text-align: center;
        margin-top: 25vw;
    }
}


// .content {
//     width: 100%;
//     height: 100vh;
//     display: flex;
//     // border: 1px solid black;

//     .leftArea {
//         width: 40%;
//         height: 100%;
//         // border: 1px solid black;
//         margin-left: 15%;

//         .topArea {
//             width: 100%;
//             height: 15%;
//             // border: 1px solid black;
//             margin-top: 5%;

//             span {
//                 display: inline-block;
//                 margin-left: 21%;
//                 margin-top: 3%;
//             }

//             input {
//                 display: inline-block;
//                 margin-left: 21%;
//             }
//         }

//         .bottomArea {
//             width: 100%;
//             height: 80%;
//             // border: 1px solid black;
//             margin-top: 5%;


//             span {
//                 display: inline-block;
//                 margin-left: 21%;
//                 margin-top: 3%;
//                 display: flex;
//                 flex-direction: column;

//             }

//             .checkbox {
//                 width: 50%;
//                 height: 70vh;
//                 // border: 1px solid black;
//                 display: flex;
//                 justify-content: space-evenly;
//                 margin-left: 8%;

//                 .label {
//                     display: flex;
//                     flex-direction: column;
//                     width: 70%;
//                     height: 90%;
//                     text-align: center;

//                     label {
//                         margin: 10px;
//                     }
//                 }

//                 .input {
//                     display: flex;
//                     flex-direction: column;
//                     width: 20%;
//                     height: 90%;
//                     text-align: center;

//                     input {
//                         margin: 13px;
//                     }

//                 }
//             }
//         }
//     }

//     .rightArea {
//         width: 20%;
//         height: 50%;
//         // border: 1px solid black;
//         margin-top: 12%;

//         input {
//             height: 7%;
//         }

//         p {
//             height: 4%;
//         }

//         button {
//             width: 30%;
//             height: 10%;
//             font-size: 14px;
//         }

//         .delete {
//             height: 100%;
//             width: 100%;
//             margin-top: 5%;
//         }
//     }
// }
</style>
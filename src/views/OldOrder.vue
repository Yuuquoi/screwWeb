<script>
import Swal from 'sweetalert2'

export default{
    data(){
        return{
            mode: 0,   // 0:defalt 1:check 2:edit 3:add 
            // 存放所有單號的變數
            orderList: "",
            // 目前點擊的單號資訊
            orderWatching: {},
            // 裝取單號資料的變數
            orderNumber: "",
            name:"",
            weight:"",
            aim:"",
            rawNumber:1,
            rawArr:[{name:"", amount:"", carbonCoefficient:""}],
            produceNumber:1,
            produceArr:[{name:"", amount:"", carbonCoefficient:""}],
            carbonEmission:{
                "條鋼盤元": "公斤(kg)",
                "線材盤元": "公斤(kg)",
                "球化條鋼盤元": "公斤(kg)",
                "球化線材盤元": "公斤(kg)",
                "鹽酸 (37%)": "公斤(kg)",
                "天然氣": "立方公尺(m3)",
                "氫氧化鈉/液鹼 (45%)": "公斤(kg)",
                "鋅錠": "公斤(kg)",
                "再生鋅錠": "公斤(kg)",
                "再生鋅合金錠": "公斤(kg)",
                "電力": "度"
            }
        }
    },
    methods:{
        // 內部編輯功能
        // 增加原料或製程
        addRawOrProduce(type){
            let obj = {name:"", amount:"", carbonCoefficient:""};
            switch (type) {
                case "raw":
                    this.rawArr.push(obj);
                    this.rawNumber++;
                    break;
                default:
                    obj.name = 0;
                    obj.carbonCoefficient = 0;
                    this.produceArr.push(obj);
                    this.produceNumber++;
            }
        },
        // 刪除原料或製程
        delRawOrProduce(type, index){
            switch (type) {
                case "raw":
                    this.rawArr.splice(index, 1);
                    this.rawNumber--;
                    break;
                default:
                    this.produceArr.splice(index, 1);
                    this.produceNumber--;
            }
        },
        // 取消
        addCancelEvent(){
            Swal.fire({
                title: "確認要取消嗎？",
                text: "修改的內容無法復原",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "確認",
                cancelButtonText: "取消"
            }).then((result) => {
                if (!result.isConfirmed) {
                    return;
                }
                if(this.mode === 2){
                    this.mode = 1;
                } else {
                    this.mode = 0;
                }
            });
        },
        // 送出
        addSubmitEvent(){
            // 防呆
            if(!this.orderNumber){
                this.alarmEvent("單號不可為空");
                return;
            }
            if(!this.name){
                this.alarmEvent("品名不可為空");
                return;
            }
            if(!this.weight){
                this.alarmEvent("單顆商品重量不可為空");
                return;    
            }
            if(this.weight < 0){
                this.alarmEvent("單顆商品重量不可為負");
                return;    
            }
            if(!this.aim){
                this.alarmEvent("訂購總量不可為空");
                return;    
            }
            if(this.aim < 1){
                this.alarmEvent("訂購總量需至少為 1");
                return;    
            }
            if(!this.rawNumber){
                this.alarmEvent("原料消耗資訊不可為空");
                return;    
            }
            for(let index in this.rawArr){
                if(!this.rawArr[index].name){
                    this.alarmEvent("原料名稱不可為空");
                    return;
                }
                if(!this.rawArr[index].amount){
                    this.alarmEvent("原料使用量不可為空");
                    return;
                }
                if(this.rawArr[index].amount < 0){
                    this.alarmEvent("原料使用量不可為負");
                    return;
                }
                if(!this.rawArr[index].carbonCoefficient){
                    this.alarmEvent("原料碳排係數不可為空");
                    return;
                }
                if(this.rawArr[index].carbonCoefficient < 0){
                    this.alarmEvent("原料碳排係數不可為負");
                    return;
                }
            }
            if(!this.produceNumber){
                this.alarmEvent("製程消耗或排放資訊不可為空");
                return;
            }
            for(let index in this.produceArr){
                if(this.produceArr[index].name == 0){
                    this.alarmEvent("請選擇製程消耗物或排放物");
                    return;
                }
                if(!this.produceArr[index].amount){
                    this.alarmEvent("製程消耗物或排放物使用量不可為空");
                    return;
                }
                if(this.produceArr[index].amount < 0){
                    this.alarmEvent("製程消耗物或排放物使用量不可為負");
                    return;
                }
            }
            // 送出資料給後端
            let orderReq = {
                orderNumber: this.orderNumber,
                name: this.name,
                aim: this.aim,
                weight: this.weight,
                rawObj: this.rawArr,
                produceObj: this.produceArr
            };
            console.log(orderReq);
            if(this.mode === 3){
                fetch("http://localhost:8080/order/create",{
                method: 'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(orderReq)
            })
            .then(res => res.json())
            .then((data) => {
                if(data.code != 200){
                    console.log(data);
                    this.alarmEvent(data.message);
                    return;
                }
                this.successEvent("成功新增一筆單號");
                window.location.reload()
            });
            }
            if(this.mode === 2){
                fetch("http://localhost:8080/order/edit",{
                method: 'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(orderReq)
            })
            .then(res => res.json())
            .then((data) => {
                if(data.code != 200){
                    console.log(data);
                    this.alarmEvent(data.message);
                    return;
                }
                this.successEvent("成功新增一筆單號");
                window.location.reload()
            });                
            }
        },
        // 哪種編輯模式
        // 新增單號
        addBtnClickEvent(){
            this.orderNumber = "";
            this.name = "";
            this.weight = "";
            this.aim = "";
            this.rawNumber = 1;
            this.rawArr = [{name:"", amount:"", carbonCoefficient:""}];
            this.produceNumber = 1;
            this.produceArr = [{name:"0", amount:"", carbonCoefficient:""}],
            this.mode = 3;
        },
        // 編輯單號
        editEvent(){
            this.mode = 2;
        },
        // 刪除單號
        delEvent(){
            Swal.fire({
                title: "確認刪除？",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "確認，我要刪除",
                cancelButtonText: "取消"
            }).then((result) => {
                if (!result.isConfirmed) {
                    return;
                }
                fetch(`http://localhost:8080/order/delete?orderNumber=${this.orderWatching.orderNumber}`, {
                    method: 'POST',
                    headers: {
                    "Content-Type": "application/json"
                    },
                })
                .then(res => res.json())
                .then((data) => {
                    if(data.code != 200){
                        this.alarmEvent(data.message);
                        return;
                    }
                    this.successEvent("成功刪除一筆單號");
                    window.location.reload();
                });
            });
        },
        // 其他
        produceIsPowerEvent(index){
            if(this.produceArr[index].name === "電力"){
                this.produceArr[count-1].amount = "";
            }
        },
        alarmEvent(str){
            Swal.fire({
                icon: "error",
                title: "失敗",
                text: str,
            });
        },
        successEvent(str){
            Swal.fire({
                icon: "success",
                title: "成功",
                text: str,
            });
        },
        // 搜尋單號
        fetchOrder(){
            let searchReq = {
                orderNumber: "",
                name: ""
            };
            fetch("http://localhost:8080/order/search",{
                method: 'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(searchReq)
            })
            .then(res => res.json())
            .then((data) => {
                if(data.code != 200){
                    console.log(data);
                    return;
                }
                this.orderList = data.screwMaterialList;
                console.log(this.orderList);
            });
        },
        // 確認單號
        checkOrder(item){
            this.orderWatching = item;
            this.orderNumber = this.orderWatching.orderNumber;
            this.name = this.orderWatching.name;
            this.weight = this.orderWatching.weight;
            this.aim = this.orderWatching.aim;
            this.rawNumber = this.orderWatching.raw.length;
            this.rawArr = this.orderWatching.raw;
            this.produceNumber = this.orderWatching.process.length;
            this.produceArr = this.orderWatching.process;
            this.mode = 1;
        }
    },
    beforeCreate() {
            if(!sessionStorage.getItem("account")){
                this.$router.push('/Login');
            }
        },
    mounted(){
        this.fetchOrder();
    },
}
</script>

<template>
<body>
    <div class="leftArea">
        <div class="machineStatus">
            <p class="title">訂單管理</p>
            <div class="detail">
                <span class="machineNumber">單號</span>
                <span class="type">名稱</span>
            </div>
    
            <!-- 最多可以 17 筆 -->
            <div class="content">
                <div class="item" v-for="item in this.orderList" @click="this.checkOrder(item.name)">
                    <span class="machineNumber">{{ item.orderNumber }}</span>
                    <span class="status" :class="item.status">{{ item.name }}</span>
                </div>
            </div>

        <div class="button">
            <button class="now" v-for="i in 1"></button>
            <span>( 共 {{ this.orderList.length }} 筆 )</span>
        </div>
        </div>
        <div class="addMachine" @click="addBtnClickEvent">新增</div>
    </div>

    <div class="rightArea">
        <p class="defaltText" v-if="this.mode === 0">點選左側列表操作</p>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <div class="orderDetail" v-if="this.mode !== 0">
            <h1 v-if="this.mode === 1 || this.mode === 2">單號：{{ this.orderWatching.orderNumber }}</h1>
            <h1 v-if="this.mode === 3">新增單號</h1>
            <p v-if="this.mode === 3" class="oneLine">
                <label for="">單號　　</label>
                <input type="text" :disabled="this.mode === 1" v-model.lazy="this.orderNumber">
            </p>
            <p class="oneLine">
                <label for="">品名　　</label>
                <input type="text" :disabled="this.mode === 1" v-model.lazy="this.name">
            </p>
            <p class="oneLine">
                <label for="">重量　　</label>
                <input type="number" :disabled="this.mode === 1" v-model.lazy="this.weight">
                <span>公克／顆</span>
            </p>
            <p class="oneLine">
                <label for="">訂購總量</label>
                <input type="number" :disabled="this.mode === 1" v-model.lazy="this.aim">
                <span>顆</span>
            </p>
            <div class="rawDetail inputDetail">
                <table>
                    <tr>
                        <th scope="col" :rowspan="this.rawNumber+1" class="inputTitle">原料</th>
                        <th scope="col" class="name">名稱</th>
                        <th scope="col">碳排係數</th>
                        <th scope="col">使用量（噸）</th>
                        <th scope="col" v-if="this.mode === 2 || this.mode === 3"></th>
                    </tr>
                    <tr v-for="count in this.rawNumber">
                        <td><input type="text" :disabled="this.mode === 1" v-model.lazy="this.rawArr[count-1].name"></td>
                        <td><input type="number" :disabled="this.mode === 1" v-model.lazy="this.rawArr[count-1].carbonCoefficient"></td>
                        <td><input type="number" :disabled="this.mode === 1" v-model.lazy="this.rawArr[count-1].amount"></td>
                        <td  v-if="this.mode === 2 || this.mode === 3"><i class="fa-solid fa-xmark" @click="delRawOrProduce('raw', count-1)"></i></td>
                    </tr>
                    <tr v-if="this.mode === 2 || this.mode === 3">
                        <td colspan="4">
                            <button type="button" class="addBtn" @click="addRawOrProduce('raw')"><i class="fa-solid fa-plus"></i></button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="produceDetail inputDetail">
                <table>
                    <tr>
                        <th scope="col" :rowspan="this.produceNumber+1" class="inputTitle">製程</th>
                        <th scope="col" class="name">名稱</th>
                        <th scope="col">使用量（單位）</th>
                        <th scope="col" class="deleteCol" v-if="this.mode === 2 || this.mode === 3"></th>
                    </tr>
                    <tr  v-for="count in this.produceNumber">
                        <td><select :disabled="this.mode === 1" v-model.lazy="this.produceArr[count-1].name" @change="produceIsPowerEvent(count-1)">
                            <option value="0">請選擇</option>
                            <option v-for="(item, index) in this.carbonEmission" :value="index">{{ index }}</option>
                        </select></td>
                        <td><input type="number" :disabled="this.mode === 1 || this.produceArr[count-1].name === '電力'" v-model.lazy="this.produceArr[count-1].amount">（<span>{{ this.carbonEmission[this.produceArr[count-1].name] }}</span>）</td>
                        <td v-if="this.mode === 2 || this.mode === 3"><i class="fa-solid fa-xmark" @click="delRawOrProduce('produce', count-1)"></i></td>
                    </tr>
                    <tr v-if="this.mode === 2 || this.mode === 3">
                        <td colspan="3">
                            <button type="button" class="addBtn" @click="addRawOrProduce('produce')"><i class="fa-solid fa-plus"></i></button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="operateButton">
                <button type="button" v-if="this.mode === 1" @click="editEvent">編輯</button>　　
                <button type="button" v-if="this.mode === 1" @click="delEvent">刪除</button>
                <button type="button" v-if="this.mode === 2 || this.mode === 3" @click="addCancelEvent">取消</button>　　
                <button type="button" v-if="this.mode === 2 || this.mode === 3" @click="addSubmitEvent">送出</button>
            </div>
        </div>
    </div>
</body>
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
                background-color: var(--green);
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
            color: var(--green);
            font-weight: 600;
            width: 50%;
            height: 2vw;
            border: 2px solid var(--green);
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


.rightArea{
    display: flex;
    .orderList{
        margin-top: 2vw;
        margin-left: 2vw;
        width: 20vw;;
        .addOrder{
            width: 7vw;
            height: 3vw;
            margin-top: 1vw;
            margin-left: 6.4vw;
        }
        table {
            width: 100%;
            border: 2px solid rgb(206, 206, 206);
            border-collapse: collapse;
            .contain{
                cursor: pointer;
            }
            td {
                padding: 10px;
            }
            tr:nth-child(odd) {
                background-color: rgb(242, 242, 242);
            }
        }
    }
    .defaltText{
        margin-top: 2vw;
        margin-left: 15vw;
    }
    .orderDetail{
        margin-top: 2vw;
        margin-left: 4vw;
        h1{
                margin-bottom: 2vw;
            }
        .oneLine{
            margin-bottom: 1vw;
            font-size: 1.3vw;
            label{
                margin-right: 2vw;
            }
            input{
                padding-top: 0.2vw;
                padding-bottom: 0.2vw;
                padding-left: 0.5vw;
                width: 20vw;
                font-size: 1.3vw;   
                margin-right: 1vw;
            }             
        }
        .inputDetail{
            table {
                margin-top: 2vw;
                width: 100%;
                border: 2px solid rgb(206, 206, 206);
                border-collapse: collapse;
                td {
                    padding: 10px;
                    text-align: center;
                    input{
                        font-size: 1.3vw;
                        padding: 0.2vw;
                        text-align: center;
                    }
                    select{
                        width: 100%;
                        font-size: 1.3vw;
                        padding: 0.2vw;
                        text-align: center;                        
                    }
                    .fa-xmark{
                        font-size: 1.5vw;
                        margin-right: 1vw;
                        &:hover{
                            color: red;
                            cursor: pointer;
                        }
                    }
                }
                tr{
                    .deleteCol{
                        width: 1vw;
                    }
                    .name{
                        width: 18vw;
                    }
                    .addBtn{
                        cursor: pointer;
                        margin-left: 3vw;
                        margin-top: 0.1vw;
                        width: 95%;
                        height: 2vw;                   
                    }
                }
                tr:nth-child(1) {
                    background-color: rgb(242, 242, 242);
                    height: 2vw;
                }
                .inputTitle{
                    width: 2vw;
                    font-size: 1.3vw;   
                    padding-left: 0.5vw;
                    padding-right: 0.5vw;
                }
            }
            // .addBtn{
            //         margin-left: 3vw;
            //         margin-top: 0.1vw;
            //         border: 1px solid black;
            //         background-color: rgb(242, 242, 242);
            //         width: 95%;
            //         height: 2vw;                   
            //     }
        }
        .operateButton{
            margin-top: 2vw;
            text-align: center;
            button{
                width: 7vw;
                height: 4vw;
                font-size: 1.2vw;
                cursor: pointer;
            }
        }
    }
}
</style>
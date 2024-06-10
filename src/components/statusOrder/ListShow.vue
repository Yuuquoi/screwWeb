<script>

export default {
    methods: {

        // 改變顯示分頁
        changeTab(tabNumber) {
            if (this.tab === tabNumber) {
                return;
            }
            this.tab = tabNumber;
        },

    },
    data() {
        return {

            // 模式管理
            tab: 0,

            // 畫面呈現
            dataStatic: null,
            dataDynamic: null,

        }
    },
    props:[
        "data1",
        "data2",
    ]
}
</script>

<template>

    <div class="tabBlock">
        <button :class="{ now: this.tab === 0 }" @click="changeTab(0)">訂單資料</button>
        <button :class="{ now: this.tab === 1 }" @click="changeTab(1)">製造資訊</button>
        <button :class="{ now: this.tab === 2 }" @click="changeTab(2)">績效分析</button>
    </div>

    <div class="orderInfoBlock tabShowBlock" v-show="this.tab === 0">

        <div class="basicInfo infoBlock">
            <div class="line" v-if="this.data1">
                <label for="orderNumber">訂單編號</label>
                <input type="text" :value="this.data1.orderNumber">
            </div>
            <div class="line" v-if="this.data1">
                <label for="orderStatus">　狀態　</label><input id="orderStatus" type="text" :value="this.data1.status" disabled>
            </div>
            <div class="line" v-if="this.data1">
                <label for="orderProduct">訂購品項</label><input id="orderProduct" type="text" :value="this.data1.item" disabled>
            </div>
            <div class="line" v-if="this.data1">
                <label for="orderAmount">訂購數目</label><input id="orderAmount" type="number" :value="this.data1.number" disabled>
            </div>
        </div>

        <div class="orderContactInfo infoBlock">
            <p>訂購人資訊</p>
            <div class="line" v-if="this.data1">
                <label for="orderPerson">名稱</label><input class="oneLineLeft" id="orderPerson" type="text" :value="this.data1.purchaserName" disabled>
                <label for="orderPersonContact">電話</label><input id="orderPersonContact" type="tel" :value="this.data1.purchaserPhone" disabled>
            </div>
            <div class="line topBlock" v-if="this.data1">
                <label for="orderPersonAddress">地址</label><input class="address" id="orderPersonAddress" type="text" :value="this.data1.purchaserAddress"
                    disabled>
            </div>

            <p>收件人資訊</p>
            <div class="line" v-if="this.data1">
                <label for="receivePerson">名稱</label><input class="oneLineLeft" id="receivePerson" type="text" :value="this.data1.receiverName" disabled>
                <label for="receivePersonContact">電話</label><input id="receivePersonContact" type="tel" :value="this.data1.receiverPhone" disabled>
            </div>
            <div class="line" v-if="this.data1">
                <label for="receiveAddress">地址</label><input class="address" id="receiveAddress" type="text" :value="this.data1.receiverAddress" disabled>
            </div>

        </div>

        <div class="noteInfo infoBlock">
            <p>備註</p>
            <div class="line" v-if="this.data1">
                <textarea name="note" id="noteInfo" :value="this.data1.note" disabled></textarea>
            </div>
        </div>

    </div>

    <div class="manufactureBlock tabShowBlock" v-show="this.tab === 1">

        <div class="manufactureFlow">

            <div class="oneFlow">
                <span>抽線</span>
                <div class="circle" :class="{ need: this.data2.startProcessIndex === 0 }"></div>
            </div>

            <div class="line line1" :class="{ need: this.data2.startProcessIndex <= 0 && this.data2.endProcessIndex >=1 }"></div>

            <div class="oneFlow">
                <span>鍛造</span>
                <div class="circle" :class="{ need: this.data2.startProcessIndex <= 1 && this.data2.endProcessIndex >= 1 }"></div>
            </div>

            <div class="line line2":class="{ need: this.data2.startProcessIndex <= 1 && this.data2.endProcessIndex >=2 }"></div>

            <div class="oneFlow">
                <span>輾牙</span>
                <div class="circle" :class="{ need: this.data2.startProcessIndex <= 2 && this.data2.endProcessIndex >= 2 }"></div>
            </div>

            <div class="line line3":class="{ need: this.data2.startProcessIndex <= 2 && this.data2.endProcessIndex >=3 }"></div>

            <div class="oneFlow">
                <span>熱處理</span>
                <div class="circle" :class="{need: this.data2.startProcessIndex <= 3 && this.data2.endProcessIndex >= 3}"></div>
            </div>

            <div class="line line4":class="{ need: this.data2.startProcessIndex <= 3 && this.data2.endProcessIndex >=4 }"></div>

            <div class="oneFlow">
                <span>電鍍</span>
                <div class="circle" :class="{need: this.data2.startProcessIndex <= 4 && this.data2.endProcessIndex === 4}"></div>
            </div>

        </div>

        <div class="table">

            <table  v-if="this.data2.pullThreadString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">抽線</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.pullThreadString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.pullThreadString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 瓦特 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>
            </table>

            <table  v-if="this.data2.formingString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">鍛造</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-if="this.data2.formingString.raw" v-for="item in this.data2.formingString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.formingString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>
            </table>

            <table  v-if="this.data2.grindTeethString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">輾牙</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-if="this.data2.grindTeethString.raw" v-for="item in this.data2.grindTeethString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.grindTeethString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>
            </table>

            <table  v-if="this.data2.heatTreatmentString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">熱處理</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-if="this.data2.heatTreatmentString.raw" v-for="item in this.data2.heatTreatmentString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.heatTreatmentString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>
            </table>

            <table  v-if="this.data2.electroplatingString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">電鍍</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-if="this.data2.electroplatingString.raw" v-for="item in this.data2.electroplatingString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                </tr>

                <tr class="item" v-for="item in this.data2.electroplatingString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                </tr>
            </table>
        </div>

    </div>

    <div class="statisticsBlock tabShowBlock" v-show="this.tab === 2">

        <!-- <div class="traceTable statisticsTable">

            <p class="title">進度追蹤</p>
            <div class="table">
                <p>目標生產量：{{ this.data2.aim }}</p>
                <table>
                    <tr>
                        <td scope="col" class="manufactureName title">流程</td>
                        <td scope="col" class="machineName title">生產機台</td>
                        <td scope="col" class="produce title">累積生產量 (顆)</td>
                        <td scope="col" class="passRatio title">良率 (%)</td>
                        <td scope="col" class="finishRatio title">完成率 (%)</td>
                        <td scope="col" class="finishTime title">預估完成時間</td>
                    </tr>

                    <tr class="item">
                        <td>鍛造成型</td>
                        <td>YBF-1</td>
                        <td>2400</td>
                        <td>90%</td>
                        <td>24%</td>
                        <td>2024-06-10 01:31</td>
                    </tr>
                    <tr class="item">
                        <td>輾牙</td>
                        <td>CDH-1</td>
                        <td>0</td>
                        <td>-</td>
                        <td>0%</td>
                        <td>-</td>
                    </tr>
                </table>
            </div>

        </div> -->

        <div class="carbonEmissionTable statisticsTable">
            <p class="title bottom">碳排放計算</p>

            <div class="table">

                <table  v-if="this.data2.pullThreadString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">抽線</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.pullThreadString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.pullThreadString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon/(this.data2.aim*this.data2.weight/1000) }}</td>
                </tr>
                </table>

                <table  v-if="this.data2.formingString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">鍛造</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.formingString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.formingString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon/(this.data2.aim*this.data2.weight/1000) }}</td>
                </tr>
                </table>

                <table  v-if="this.data2.grindTeethString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">輾牙</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.grindTeethString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.grindTeethString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon/(this.data2.aim*this.data2.weight/1000) }}</td>
                </tr>
                </table>

                <table  v-if="this.data2.heatTreatmentString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">熱處理</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.heatTreatmentString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.heatTreatmentString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon/(this.data2.aim*this.data2.weight/1000) }}</td>
                </tr>
                </table>

                <table  v-if="this.data2.electroplatingString">
                <tr>
                    <td rowspan="4" scope="col" class="manufactureName title">電鍍</td>
                    <td scope="col" class="name title">原料名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td scope="col" class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.electroplatingString.raw">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}<span> ( 公噸 ) </span></td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon }}</td>
                </tr>

                <tr>
                    <td class="name title">製程消耗物/排放物名稱</td>
                    <td scope="col" class="amount title">使用量</td>
                    <td class="carbonEmission title">碳排放係數</td>
                    <td scope="col" class="carbonEmissionAmount title">碳排放量</td>
                </tr>

                <tr class="item" v-for="item in this.data2.electroplatingString.process">
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.carbon }}</td>
                    <td>{{ item.amount*item.carbon/(this.data2.aim*this.data2.weight/1000) }}</td>
                </tr>
                </table>

            </div>

        </div>


        <!-- <div class="linkArea">
            <button>統計圖呈現</button>
        </div> -->


    </div>
</template>

<style lang="scss" scoped>
// 基本樣式
.tabBlock {
    width: 100%;
    height: 8%;

    // border: 1px solid red;
    button {
        cursor: pointer;
        width: 8%;
        height: 100%;
        font-size: 1vw;
        border-radius: 13px 13px 0px 0px;
        background-color: var(--greenLight);
    }
}

.tabShowBlock {
    width: 100%;
    height: 92%;
    border: 0.15vw solid var(--green);
    padding-left: 1vw;
    // border: 1px solid red;
    display: flex;

    .infoBlock {
        width: 24vw;
        border-right: 1px solid var(--green);
        padding-left: 2.5vw;
        padding-right: 2.5vw;
        padding-top: 1vw;

        p {
            font-size: 1vw;
            text-align: center;
        }

        .line {
            width: 18vw;
            margin-top: 1vw;
            margin-bottom: 1vw;

            label {
                width: 10vw;
                margin-right: 1vw;

                font-size: 1.1vw;
            }

            input {
                width: 10vw;
                border: 1px solid black;
                padding: 0.1vw;
                font-size: 1.1vw;
            }

            select {
                width: 10vw;
                border: 1px solid black;

                font-size: 1.1vw;

                option {
                    font-size: 1.1vw;
                }
            }

            textarea {
                width: 100%;
                height: 33vh;
                border: 1px solid black;
                padding: 0.1vw;
                resize: none;

                font-size: 1.1vw;
            }

            span {
                font-size: 1.1vw;
            }
        }

    }
}

.orderInfoBlock {

    .infoBlock {

        .line {
            #voltage {
                width: 38%;
            }

            #buyPrice {
                width: 47%;
            }
        }
    }

    .basicInfo {
        padding-left: 5vw;
        padding-top: 2.5vw;
        width: 26vw;
    }

    .orderContactInfo {
        width: 40vw;
        padding-left: 5vw;

        p {
            padding-left: 12.5vw;

            text-align: left;
        }

        .line {
            width: 50vw;

            .oneLineLeft {
                margin-right: 4vw;
            }

            .address {
                width: 27.2vw;
            }
        }

        .topBlock {
            margin-bottom: 2.5vw;
        }
    }

    .noteInfo {
        border-right: 0px;
        padding-left: 4.3vw;

        p {
            padding-left: 7.9vw;

            text-align: left;
        }
    }

}

.manufactureBlock {
    width: 100%;
    height: 92%;
    padding-left: 0px;
    display: block;

    .manufactureFlow {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .oneFlow {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 0.5vw;
            margin-left: 0.6vw;
            margin-right: 0.6vw;
            margin-bottom: 0.5vw;

            span {
                font-size: 0.9vw;
            }

            .circle {
                width: 0.7vw;
                height: 0.7vw;
                background-color: var(--greenLight);
                border-radius: 50%;
            }
        }

        .line {
            width: 2.8vw;
            border-bottom: 0.15vw solid var(--greenLight);
            position: absolute;
            top: 71%;
            z-index: -1;
        }

        .line1 {
            left: 43%;
        }

        .line2 {
            left: calc(43% + 3vw);
        }

        .line3 {
            width: 3.2vw;
            left: calc(43% + 6vw);
        }

        .line4 {
            width: 3.2vw;
            left: calc(43% + 9.5vw);
        }
    }

    .table {
        width: 80%;
        max-height: 86%;
        overflow-y: scroll;
        margin-left: 9vw;

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0.2vw;

            .item {
                height: 5vh;
            }

            tr {
                .title {
                    height: 4vh;
                }

                td {
                    word-wrap: break-word;
                    font-size: 1vw;
                    vertical-align: center;
                    text-align: center;

                    span {
                        font-size: 0.7vw;
                    }
                }

                .manufactureName {
                    width: 8vw;
                    background-color: #f2f2f2;
                    border: 0;

                    text-align: center;
                    font-size: 1.1vw;
                    font-weight: 500;
                }

                .name {
                    width: 22vw;
                    background-color: #f2f2f2;
                    border: 0;

                    font-size: 0.9vw;
                    font-weight: 500;
                }

                .amount {
                    width: 15vw;
                    background-color: #f2f2f2;
                    border: 0;

                    font-size: 0.9vw;
                    font-weight: 500;
                }

                .carbonEmission {
                    background-color: #f2f2f2;
                    border: 0;

                    font-size: 0.9vw;
                    font-weight: 600;
                }
            }
        }
    }
}

.statisticsBlock {
    width: 100%;
    height: 44vh;
    padding: 0px;
    padding-top: 1vw;
    display: flex;
    justify-content: center;

    .statisticsTable {

        .title {
            text-align: left;
            font-size: 1vw;
            font-weight: 600;
        }

        .table {
            width: 100%;
            max-height: 86%;
            overflow-y: scroll;

            table {
                width: 100%;
                border-collapse: collapse;

                tr {
                    td {
                        word-wrap: break-word;
                        font-size: 1vw;
                        vertical-align: center;
                        text-align: center;
                    }
                }
            }
        }
    }

    .traceTable {
        width: 50%;
        margin-left: 2vw;
        margin-right: 1vw;

        .title {
            width: 100%;
            text-align: center;
            font-weight: 600;
        }

        .bottom {
            margin-top: 0.2vw;
            margin-bottom: 0.2vw;
        }

        .table {
            width: 100%;
            max-height: 86%;
            overflow-y: scroll;

            // border: 1px solid black;
            // margin-left: 9vw;
            p {
                text-align: left;
                margin-top: 0.2vw;
                margin-bottom: 0.2vw;

                font-size: 0.9vw;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 0.2vw;

                .item {
                    height: 5vh;
                    border-bottom: 1px solid var(--greenLight);
                }

                tr {
                    .title {
                        height: 4vh;
                        font-weight: 500;
                    }

                    td {
                        word-wrap: break-word;
                        font-size: 1vw;
                        vertical-align: center;
                        text-align: center;

                        span {
                            font-size: 0.7vw;
                        }
                    }

                    .manufactureName {
                        width: 6vw;
                        background-color: #f2f2f2;
                    }

                    .machineName {
                        width: 7vw;
                        background-color: #f2f2f2;
                    }

                    .produce {
                        width: 13vw;
                        background-color: #f2f2f2;
                    }

                    .passRatio {
                        width: 6vw;
                        background-color: #f2f2f2;
                    }

                    .finishRatio {
                        width: 8vw;
                        background-color: #f2f2f2;
                    }

                    .estimateFinishTime {
                        width: 11vw;
                        background-color: #f2f2f2;
                    }

                    .finishTime {
                        width: 15vw;
                        background-color: #f2f2f2;
                    }
                }
            }
        }
    }

    .carbonEmissionTable {
        width: 30%;
        margin-left: 2vw;

        .title {
            width: 100%;
            text-align: center;
        }

        .bottom {
            margin-top: 0.2vw;
            margin-bottom: 0.2vw;
        }

        .table {
            width: 100%;
            max-height: 86%;
            overflow-y: scroll;

            // border: 1px solid black;
            // margin-left: 9vw;
            p {
                text-align: left;
                margin-top: 0.2vw;
                margin-bottom: 0.2vw;

                font-size: 0.9vw;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 0.2vw;
                margin-top: 1.2vw;

                .item {
                    height: 5vh;
                    border-bottom: 1px solid var(--greenLight);
                }

                tr {
                    .title {
                        height: 4vh;
                    }

                    td {
                        word-wrap: break-word;
                        font-size: 1vw;
                        vertical-align: center;
                        text-align: center;

                        span {
                            font-size: 0.7vw;
                        }
                    }

                    .manufactureName {
                        width: 2vw;
                        background-color: #f2f2f2;
                        border: 0;
                        padding-left: 0.2vw;
                        padding-right: 0.2vw;

                        text-align: center;
                        font-size: 1vw;
                        font-weight: 500;
                    }

                    .name {
                        width: 5vw;
                        background-color: #f2f2f2;
                        border: 0;

                        font-size: 0.9vw;
                        font-weight: 500;
                    }

                    .amount {
                        width: 6vw;
                        background-color: #f2f2f2;
                        border: 0;

                        font-size: 0.9vw;
                        font-weight: 500;
                    }

                    .carbonEmission {
                        width: 6vw;
                        background-color: #f2f2f2;
                        border: 0;

                        font-size: 0.9vw;
                        font-weight: 600;
                    }

                    .carbonEmissionAmount{
                        width: 6vw;
                        background-color: #f2f2f2;
                        border: 0;

                        font-size: 0.9vw;
                        font-weight: 600;
                    }
                }
            }
        }
    }

}

.linkArea {
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
        display: block;
        width: 7.5vw;
        height: 6vh;
        background-color: var(--greenLight);
        border: 1px solid var(--green);
        border-radius: 10px;

        font-size: 1.2vw;

        &:hover {
            cursor: pointer;
            background-color: var(--green);
        }
    }
}

// 特殊樣式：按鈕-現在頁面
.tabBlock {
    .now {
        background-color: var(--green);
    }
}

// 特殊樣式：該單號的流程
.manufactureBlock{
    .manufactureFlow{

        .oneFlow{
            .need {
                background-color: var(--green);
            }
        }

        .need{
            border-color: var(--green);
        }
    }
}
</style>
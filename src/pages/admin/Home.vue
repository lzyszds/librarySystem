<script setup lang="ts">
import http, { HttpResonse } from "@/http";
import * as echarts from "echarts";
import { LogListType } from "@/type/LogList";
import { useStore } from "@/store";
import { useEventListener } from "@vueuse/core";
import { gsap } from "gsap";

import { delaySync } from "@/utils/utils";
import LzyIcon from "@/components/lzyIcon.vue";

const store = useStore();
let myChart, myChartCopy, myChartCenter;
let chartDom, chartDomCopy, chartDomCenter;
let option, optionCopy, optionCenter;

const data = ref<any[]>([
  {
    name: "新增用户",
    icon: "typcn:user-add",
    value: 0,
    click: () => {},
  },
  {
    name: "新增图书",
    icon: "typcn:book",
    value: 0,
  },
  {
    name: "借书",
    icon: "typcn:document-delete",
    value: 0,
  },
  {
    name: "还书",
    icon: "typcn:document-add",
    value: 0,
  },
  {
    name: "浏览量",
    icon: "typcn:eye",
    value: 0,
  },
]);

onMounted(() => {
  //中间的图表
  chartDomCenter = document.getElementById("echartsCenter");
  myChartCenter = echarts.init(chartDomCenter);

  //四个参数的统计图
  chartDom = document.getElementById("echartsMain");
  myChart = echarts.init(chartDom);
  //浏览量的统计图
  chartDomCopy = document.getElementById("echartsCopy");
  myChartCopy = echarts.init(chartDomCopy);

  http("get", "/admin/Api/log/getLogList?limit=7").then(
    (res: HttpResonse<LogListType[]>) => {
      const newUsersCount = res.data.map((item) => item.newUsersCount).reverse();
      const newBooksCount = res.data.map((item) => item.newBooksCount).reverse();
      const booksBorrowedCount = res.data
        .map((item) => item.booksBorrowedCount)
        .reverse();
      const booksReturnedCount = res.data
        .map((item) => item.booksReturnedCount)
        .reverse();
      const visitsCount = res.data.map((item) => item.visitsCount).reverse();
      const logDate = res.data.map((item) => item.logDate).reverse();
      optionCenter = {
        title: {
          text: "最近7天的",
          subtext: "各数据总量",
          left: "center",
          top: "0%",
          //竖着标题
        },

        series: [
          {
            name: "访问来源",
            type: "pie",
            center: ["50%", "60%"], // 圆心位置
            radius: ["0%", "75%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true, // 显示标签
              position: "inside", // 标签位置，可根据需要调整
              formatter: "{b}: {c}", // 标签内容，{b}表示名称，{c}表示值
              fontFamily: "dindin",
              fontSize: "12",
            },
            data: [
              {
                value: newUsersCount.reduce((a, b) => a + b, 0),
                name: "新增用户",
              },
              {
                value: newBooksCount.reduce((a, b) => a + b, 0),
                name: "新增图书",
              },
              {
                value: booksBorrowedCount.reduce((a, b) => a + b, 0),
                name: "借书",
              },
              {
                value: booksReturnedCount.reduce((a, b) => a + b, 0),
                name: "还书",
              },
            ],
          },
        ],
      };

      option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          tooltip: {
            show: true,
          },
          top: "3%",
          data: ["新增用户", "新增图书", "今日借书", "今日还书"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: logDate,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            data: newUsersCount,
          },
          {
            name: "新增图书",
            type: "line",
            data: newBooksCount,
          },
          {
            name: "今日借书",
            type: "line",
            data: booksBorrowedCount,
          },
          {
            name: "今日还书",
            type: "line",
            data: booksReturnedCount,
          },
        ],
      };
      optionCopy = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: logDate,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "浏览量",
            type: "bar",
            data: visitsCount,
            label: {
              show: true,
              position: "inside",
            },
          },
        ],
      };
      optionCenter && myChartCenter.setOption(optionCenter);
      optionCopy && myChartCopy.setOption(optionCopy);
      option && myChart.setOption(option);
      const sum = [
        newUsersCount.reduce((a, b) => a + b, 0),
        newBooksCount.reduce((a, b) => a + b, 0),
        booksBorrowedCount.reduce((a, b) => a + b, 0),
        booksReturnedCount.reduce((a, b) => a + b, 0),
        visitsCount.reduce((a, b) => a + b, 0),
      ];
      console.log(sum);
      data.value.forEach((res, index) => {
        gsap.to(data.value[index], {
          value: sum[index],
          duration: 1,
          onUpdate: () => {
            data.value[index].value = Math.floor(res.value);
          },
        });
      });
    }
  );

  useEventListener(window, "resize", () => {
    option && myChart.resize(option);
    optionCenter && myChartCenter.resize(optionCenter);
    optionCopy && myChartCopy.resize(optionCopy);
  });
  watch(
    () => store.sidebar,
    () => {
      delaySync(500, () => {
        option && myChart.resize(option);
        optionCenter && myChartCenter.resize(optionCenter);
        optionCopy && myChartCopy.resize(optionCopy);
      });
    }
  );
});
</script>

<template>
  <div class="home">
    <div class="rowTool">
      <div v-for="item in data" :key="item.icon">
        <div class="icon">
          <LzyIcon :name="item.icon" height="60"></LzyIcon>
        </div>
        <div class="content">
          <div class="title">{{ item.name }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div id="echartsMain" class="chart"></div>
    <div class="chartBotton">
      <div id="echartsCopy" class="chart"></div>
      <div id="echartsCenter" class="chart"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  background-color: var(--eee);
  padding: 10px;

  .rowTool {
    height: 120px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;

    & > div {
      background-color: var(--bgTheme);
      border-radius: 5px;
      border: 1px solid var(--theme);
      transition: 0.3s;
      height: 120px;
      flex: 1;
      justify-content: center;
      align-items: center;
      display: flex;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        cursor: pointer;
        background-color: var(--hoverTheme);
        color: #fff;
        transform: rotateX(10deg) rotateY(12deg);
        backdrop-filter: blur(10px);

        & .icon {
          color: #fff;
        }
      }

      .icon {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        color: var(--theme);
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
          font-size: max(12px, 1vw);
        }

        .value {
          font-size: clamp(1.3rem, 2vw, 3rem);
          font-weight: 600;
        }
      }
    }
  }

  #echartsMain {
    height: 450px;
    margin-top: 10px;
  }

  #echartsCopy {
    height: 100%;
    float: left;
    width: 75%;
    margin-right: 10px;
  }

  #echartsCenter {
    height: 100%;
    width: calc(25% - 14px);
    float: left;
  }

  .chartBotton {
    margin-top: 10px;
    height: 250px;
  }

  .chart {
    background-color: var(--bgTheme);
    border-radius: 5px;
    border: 1px solid var(--theme);
    color: var(--bgTheme);
  }
}

@media screen and (max-width: 869px) {
  .home {
    overflow-x: hidden;
    overflow-y: scroll;

    .rowTool {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(3, 1fr);
      height: auto;

      & > div {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        &:nth-child(5) {
          grid-column: 1/3;
        }
      }
    }

    #echartsMain {
      height: 300px;
    }

    .chartBotton {
      height: 400px;

      #echartsCopy {
        width: 100%;
        clear: both;
      }

      #echartsCenter {
        margin-top: 10px;
        width: 100%;
        clear: both;
      }
    }
  }
}
</style>

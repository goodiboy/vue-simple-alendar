<template>
  <div class="calendar" v-click-outside>
    <input type="text" :value="currentDate.stringDate" class="inner">
    <div class="pannel" v-show="isVisible">
      <div class="pannel-header">
        <span @click="chooseMonth(-1)">&lt;</span>
        <span @click="chooseYear(-1)">&lt;&lt;</span>
        <span>{{scopeDate.year}}年</span>
        <span>{{scopeDate.month+1}}月</span>
        <span @click="chooseYear(+1)">&gt;&gt;</span>
        <span @click="chooseMonth(+1)">&gt;</span>
      </div>
      <div class="pannel-main">
        <div>
          <span class="cell">日</span>
          <span class="cell">一</span>
          <span class="cell">二</span>
          <span class="cell">三</span>
          <span class="cell">四</span>
          <span class="cell">五</span>
          <span class="cell">六</span>
        </div>
        <div v-for="i of 6" :key="i">
          <span
            @click="chooseDate(visibleDays[(i-1)*7+(j-1)].itemDate)"
            :class="['cell',
            {gray:!visibleDays[(i-1)*7+(j-1)].isCurrentMonth},
            {isToday:visibleDays[(i-1)*7+(j-1)].isToday},
            {isSelect:visibleDays[(i-1)*7+(j-1)].isSelect}]"
            v-for="j of 7" :key="j">
            {{ visibleDays[(i-1)*7+(j-1)].day }}
          </span>
        </div>
      </div>
      <div class="pannel-footer" @click="chooseDate()">今天</div>
    </div>
  </div>
</template>

<script>
import util from '../util'

export default {
  name: 'Calendar',
  data () {
    const { year, month } = util.getYearMonthDay(this.value)
    return {
      isVisible: false,
      scopeDate: {
        year,
        month
      }
    }
  },
  props: {
    value: {
      type: Date,
      default: null
    }
  },
  directives: {
    clickOutside: {
      /**
       * 指令第一次绑定到元素时调用
       * @param el 指令所绑定的元素，可以用来直接操作 DOM。
       * @param binding
       * @param vnode 虚拟DOM
       * @param oldVnode
       */
      bind: (el, binding, vnode, oldVnode) => {
        const handler = (e) => {
          if (el.contains(e.target)) {
            if (vnode.context.isVisible) return
            vnode.context.focus()
          } else {
            if (!vnode.context.isVisible) return
            vnode.context.blur()
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      // 当被绑定的元素插入到 DOM 中时
      inserted: el => {
        console.log('inserted')
      },
      // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
      componentUpdated: el => {
        console.log('componentUpdated')
      },
      // 所在组件的 VNode 更新时调用
      update: el => {
        console.log('update')
      },
      // 指令与元素解绑时调用。
      unbind: (el, binding, vnode) => {
        console.log('unbind')
        document.removeEventListener('click', el.handler)
      }
    }
  },
  computed: {
    // 获取需要显示的日期
    visibleDays () {
      // 获取当前的年月
      // const { year, month } = util.getYearMonthDay(this.value)
      // 获取当月的第一天
      const firstDay = util.getDate(this.scopeDate.year, this.scopeDate.month, 1)
      // 获取当月第一天是周几
      const week = firstDay.getDay()
      /*
        // 方法一   对时间戳进行时间加减
        const startDay = new Date(firstDay - week * 1000 * 60 * 60 * 24)
        const arr = []
        for (let i = 0; i < 42; i++) {
          arr.push(new Date(startDay / 1 + i * 1000 * 60 * 60 * 24).toLocaleDateString())
        }
      */

      // 方法二 ，用setDate进行推算
      const arr = []
      for (let i = 0; i < 42; i++) {
        const dayValue = -week + 1 + i
        const itemDate = new Date(firstDay)
        itemDate.setDate(dayValue)
        const calendarItem = {
          itemDate,
          day: itemDate.getDate(),
          isCurrentMonth: util.judgeCurrentMonth(itemDate, new Date(this.scopeDate.year, this.scopeDate.month)),
          isToday: util.judgeDate(itemDate, new Date()),
          isSelect: util.judgeDate(itemDate, this.value)
        }
        arr.push(calendarItem)
      }
      return arr
    },
    // 当天日历的数据
    currentDate () {
      const { year, month, day } = util.getYearMonthDay(this.value)
      return {
        year,
        month: month + 1,
        day,
        date: this.value,
        stringDate: `${year}-${month + 1}-${day}`
      }
    }
  },
  methods: {
    // 获取焦点
    focus (e) {
      this.isVisible = true
    },
    // 取消焦点
    blur (e) {
      this.isVisible = false
    },
    // 修改日期
    chooseDate (date = new Date()) {
      this.scopeDate = util.getYearMonthDay(date)
      this.$emit('input', date)
    },
    // 修改月份
    chooseMonth (val) {
      // 获取当前的年月
      const d = util.getDate(this.scopeDate.year, this.scopeDate.month)
      // 使用setMonth修改月
      d.setMonth(d.getMonth() + val)
      // 把修改之后的年月日赋值回去
      this.scopeDate = util.getYearMonthDay(d)
    },
    // 修改年份
    chooseYear (val) {
      const d = util.getDate(this.scopeDate.year, this.scopeDate.month)
      d.setFullYear(d.getFullYear() + val)
      this.scopeDate = util.getYearMonthDay(d)
    }
  }
}
</script>
<style scoped lang="scss">
.inner {
  border: 1px solid;
}

.pannel {
  position: absolute;
  background: #fff;
  width: 32*7px;
  box-shadow: 0 0 2px 2px pink;
  border-radius: 4px;
  /*border:2px solid pink;*/
  .pannel-header {
    display: flex;
    justify-content: space-around;
    user-select: none;
    height: 30px;
    line-height: 30px;
  }

  .pannel-main {
    .cell {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-width: bold;
      width: 32px;
      height: 32px;
      box-sizing: border-box;
    }

    .gray {
      color: gray;
    }

    .isToday {
      color: hotpink;
    }

    .isSelect {
      background: lightgreen;
      border-radius: 50%;
    }

  }

  .pannel-footer {
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-top: 1px solid #666;
  }
}
</style>

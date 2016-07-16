require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/calendar.css');

import React from 'react';

var CalendarHeader = React.createClass({

    getInitialState: function() {
        return {
            year: this.props.year,
            month: this.props.month
        };
    },
    //上一月
    handleLC: function() {
        var newMonth = parseInt(this.state.month) - 1;
        var year = this.state.year;
        if (newMonth < 1) {
            year--;
            newMonth = 12;
        }

        this.state.month = newMonth;
        this.state.year = year;
        this.setState(this.state);
        this.props.updateFilter(year, newMonth); //向父组件更新数据
    },
    //下一月
    handleRC: function() {
        var newMonth = parseInt(this.state.month) + 1;
        var year = this.state.year;
        if (newMonth > 12) {
            year++;
            newMonth = 1;
        }

        this.state.month = newMonth;
        this.state.year = year;
        this.setState(this.state);
        this.props.updateFilter(year, newMonth);
    },
    render: function() {
        return (
            <div className="headerborder">
                <p className="headermonth">{this.state.month}月</p>
                <p className="headeryear">{this.state.year}年</p>
                <p className="last-month" onClick={this.handleLC}></p>
                <p className="next-month" onClick={this.handleRC}></p>
            </div>
        );
    }
});

var CalendarBody = React.createClass({
    //获得当前月份天数
    getMonthDays: function() {
        var year = this.props.year,
            month = this.props.month;
        var temp = new Date(year, month, 0);
        return temp.getDate();
    },
    //获得当前月份第一天的星期值
    getFirstDayWeek: function() {
        var year = this.props.year,
            month = this.props.month;
        var dt = new Date(year + '/' + month + '/1');
        var Weekdays = dt.getDay();
        return Weekdays;
    },
    //获得上一月份天数
    getLastMonthDays: function() {
        var year = this.props.year,
            month = this.props.month;
        var newMonth = month - 1;
        if (newMonth < 1) {
            year--;
            newMonth = 12;
        }
        var ltemp = new Date(year, newMonth, 0);
        return ltemp.getDate();
    },
    //获得下一月份第一天的星期值
    getNextMonthFirstDayWeek: function() {
        var year = this.props.year,
            month = this.props.month;
        var newMonth = month + 1;
        if (newMonth > 12) {
            newMonth = 1;
            year++;
        }
        var Ndt = new Date(year + '/' + newMonth + '/1');
        var NextWeekdays = Ndt.getDay();
        return NextWeekdays;
    },
    render: function() {
        /*
         * @arry1,@arry2,@arry3 将上一月要显示在当前也的每一天，本月的每一天，下月...分别存在数组中
         * @Nfdw 下一月第一天的星期
         * @lMdays 上一月天数
         */
        var arry1 = [],
            arry2 = [],
            arry3 = [];
        var getDays = this.getMonthDays(),
            FirstDayWeek = this.getFirstDayWeek(),
            curday = this.props.day,
            curmonth = this.props.month;
        var Nfdw = this.getNextMonthFirstDayWeek(),
            lMDays = this.getLastMonthDays();

        //将相关数据存入数组
        for (var i = 0; i < FirstDayWeek; i++) {
            arry1[i] = lMDays - FirstDayWeek + i + 1;
        }
        for (var i = 0; i < getDays; i++) {
            arry2[i] = (i + 1);
        }
        //如果下一个月第一天为周六则不用填充
        if (Nfdw === 0) {
            arry3 = [];
        } else {
            for (var i = 1; i <= 7 - Nfdw; i++) {

                arry3[i] = i;
            }
        }

        //得到每一台你的节点
        var node1 = arry1.map(function(item) {
            return <li className="greyDay" key={'l'+item}>{item}</li>
        });
        //如果是“今天”则以不同的样式显示
        var node2 = arry2.map(function(item) {
            return (curday == item && curmonth == new Date().getMonth() + 1) ? <li className='currentDay' key={item}>{item}</li> : <li  key={item}>{item}</li>
        });
        var node3 = arry3.map(function(item) {
            return <li className="greyDay" key={'n'+item}>{item}</li>
        });

        return (
            <div className="bodyborder">
                <div className="weekday">
                    <ul>
                        <li>SUN</li>
                        <li>MON</li>
                        <li>TUE</li>
                        <li>WED</li>
                        <li>THU</li>
                        <li>FRI</li>
                        <li>SAT</li>
                    </ul>
                </div>
                <div className="CalendarDay" ref="CalendarDay">
                    <ul>
                        {node1}{node2}{node3}
                    </ul>
                </div>
            </div>
        );
    }
});

var Calendar = React.createClass({
    formatDate: function(date, fmt, flag) {
        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * eg:
         * Utils.formatDate(new Date(),'yyyy-MM-dd') ==> 2014-03-02
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm') ==> 2014-03-02 05:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd HH:mm') ==> 2014-03-02 17:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
         * Utils.formatDate(new Date(),'yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
         */
        if (!date) return;
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': flag ? date.getHours() : (date.getHours() % 12 == 0 ? 12 : date.getHours() % 12), //小时
            'H+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },

    //初始化数据
    getInitialState: function() {
        var newDate = new Date();
        return {
            year: this.formatDate(newDate, 'yyyy'),
            month: parseInt(this.formatDate(newDate, 'MM')),
            day: parseInt(this.formatDate(newDate, 'dd'))
        };
    },
    //更新数据
    handleFilterUpdate: function(filterYear, filterMonth) {
        this.setState({
            year: filterYear,
            month: filterMonth
        });
    },
    render: function() {
        return (
            <div className="calendarBox">
                    <CalendarHeader
                            year = {this.state.year}
                            month = {this.state.month}
                            updateFilter={this.handleFilterUpdate} />
                    <CalendarBody
                            year = {this.state.year}
                            month = {this.state.month}
                            day = {this.state.day} />
                </div>
        );
    }
});
export default Calendar;
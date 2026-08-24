// charts.js — DevOps 学习指南图表逻辑
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#2563eb';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#059669';
  var accent3 = style.getPropertyValue('--accent3').trim() || '#d97706';
  var ink = style.getPropertyValue('--ink').trim() || '#1a1d29';
  var muted = style.getPropertyValue('--muted').trim() || '#5c6370';
  var rule = style.getPropertyValue('--rule').trim() || '#e2e6ed';
  var bg2 = style.getPropertyValue('--bg2').trim() || '#ffffff';

  // 颜色透明度变体
  function alpha(color, a) {
    if (color.indexOf('#') === 0 && color.length === 7) {
      var r = parseInt(color.slice(1, 3), 16);
      var g = parseInt(color.slice(3, 5), 16);
      var b = parseInt(color.slice(5, 7), 16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    return color;
  }

  // ========== Chart 1: DORA 指标对比 (柱状图) ==========
  var doraEl = document.getElementById('chart-dora');
  if (doraEl && typeof echarts !== 'undefined') {
    var doraChart = echarts.init(doraEl, null, { renderer: 'svg' });
    doraChart.setOption({
      animation: false,
      backgroundColor: 'transparent',
      color: [accent, accent2, accent3, alpha(accent, 0.4)],
      title: {
        text: 'DORA 四项关键指标 — 各成熟度级别对比',
        left: 'center',
        textStyle: { color: ink, fontSize: 15, fontWeight: 700, fontFamily: 'InstrumentSans, sans-serif' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        appendToBody: true,
        backgroundColor: alpha(ink, 0.9),
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: function(params) {
          var result = '<div style="font-weight:700;margin-bottom:6px">' + params[0].name + '</div>';
          params.forEach(function(p) {
            result += '<div style="margin:2px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + p.color + ';margin-right:6px"></span>' + p.seriesName + ': ' + p.value + '</div>';
          });
          return result;
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: muted, fontSize: 11 },
        itemGap: 20
      },
      grid: {
        top: 70,
        left: '8%',
        right: '5%',
        bottom: 60
      },
      xAxis: {
        type: 'category',
        data: ['初级', '中级', '高级', '精英级'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: ink, fontSize: 13, fontWeight: 600 },
        axisTick: { show: false }
      },
      yAxis: [
        {
          type: 'value',
          name: '频率/时间',
          nameTextStyle: { color: muted, fontSize: 11 },
          axisLine: { show: false },
          axisLabel: { color: muted, fontSize: 10 },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } }
        },
        {
          type: 'value',
          name: '失败率/MTTR',
          nameTextStyle: { color: muted, fontSize: 11 },
          axisLine: { show: false },
          axisLabel: { color: muted, fontSize: 10, formatter: '{value}%' },
          splitLine: { show: false },
          max: 25
        }
      ],
      series: [
        {
          name: '部署频率(次/月)',
          type: 'bar',
          data: [1, 8, 90, 1000],
          barWidth: '18%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '前置时间(天)',
          type: 'bar',
          data: [120, 15, 4, 0.5],
          barWidth: '18%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '变更失败率(%)',
          type: 'bar',
          yAxisIndex: 1,
          data: [18, 12, 7, 3],
          barWidth: '18%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        },
        {
          name: 'MTTR(小时)',
          type: 'bar',
          yAxisIndex: 1,
          data: [24, 6, 1, 0.5],
          barWidth: '18%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }
      ]
    });
    window.addEventListener('resize', function() { doraChart.resize(); });
  }

  // ========== Chart 2: DevOps 成熟度雷达图 ==========
  var radarEl = document.getElementById('chart-radar');
  if (radarEl && typeof echarts !== 'undefined') {
    var radarChart = echarts.init(radarEl, null, { renderer: 'svg' });
    radarChart.setOption({
      animation: false,
      backgroundColor: 'transparent',
      color: [accent, accent2],
      title: {
        text: 'DevOps 成熟度评估 — 六维度雷达',
        left: 'center',
        textStyle: { color: ink, fontSize: 15, fontWeight: 700, fontFamily: 'InstrumentSans, sans-serif' }
      },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: alpha(ink, 0.9),
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 12 }
      },
      legend: {
        bottom: 0,
        textStyle: { color: muted, fontSize: 12 },
        itemGap: 25
      },
      radar: {
        center: ['50%', '52%'],
        radius: '62%',
        indicator: [
          { name: '文化协作', max: 5 },
          { name: '自动化程度', max: 5 },
          { name: 'CI/CD 成熟度', max: 5 },
          { name: '可观测性', max: 5 },
          { name: '安全实践', max: 5 },
          { name: '基础设施管理', max: 5 }
        ],
        axisName: {
          color: ink,
          fontSize: 12,
          fontWeight: 600
        },
        splitLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: [alpha(accent, 0.02), alpha(accent, 0.05)] } },
        axisLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: [1.5, 1, 1, 1.5, 1, 1],
            name: '初级团队',
            areaStyle: { color: alpha(accent, 0.12) },
            lineStyle: { color: accent, width: 2 },
            itemStyle: { color: accent }
          },
          {
            value: [4.5, 4.5, 4, 4, 4, 4.5],
            name: '精英级团队',
            areaStyle: { color: alpha(accent2, 0.15) },
            lineStyle: { color: accent2, width: 2 },
            itemStyle: { color: accent2 }
          }
        ]
      }]
    });
    window.addEventListener('resize', function() { radarChart.resize(); });
  }
})();

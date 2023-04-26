function chartToCSV(chartId) {
  const chart = Chart.getChart(chartId);
  const { datasets } = chart.data;
  const { labels } = datasets.label;
  console.log(labels);
}

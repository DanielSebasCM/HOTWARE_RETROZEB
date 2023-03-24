const getMetrics = (_, res) => {
  const retrospective = {
    name: 'Retrospectiva 1',
    state: 'CLOS',
  };

  const states = ['To Do', 'En curso', 'Pull request', 'QA', 'Blocked', 'Done'];
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  let data_general = {
    label: 'Total',
    data: states.map((_) => Math.ceil(Math.random() * 15)),
  };

  const data_epics = [
    { label: 'Epic 1', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 2', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 3', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 4', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 5', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 6', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Epic 7', data: states.map((_) => Math.ceil(Math.random() * 15)) },
  ];
  const data_types = [
    { label: 'Task', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    { label: 'Bug', data: states.map((_) => Math.ceil(Math.random() * 15)) },
    {
      label: 'User story',
      data: states.map((_) => Math.ceil(Math.random() * 15)),
    },
  ];

  res.render('dashboard_metrics', {
    title: 'Dashboard Metricas',
    user: 'Hotware',
    retrospective,
    states,
    colors,
    data_general,
    data_epics,
    data_types,
  });
};

module.exports = {
  getMetrics,
};

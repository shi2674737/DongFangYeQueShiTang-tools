export const plainOptions = [
  {
    label: '普通顾客',
    value: 'normal',
  }, {
    label: '稀有顾客',
    value: 'rare',
  }
];

export const dishColumns = [
  {
    title: '菜品名称',
    dataIndex: 'name',
  },
  {
    title: '得分',
    width: '80px',
    dataIndex: 'score',
    sorter: (a, b) => b.score - a.score,
  },
  {
    title: '价格',
    width: '80px',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: '厨具',
    width: '80px',
    dataIndex: 'cook',
  },
  {
    title: '材料',
    dataIndex: 'useList',
    customRender: ({record}) => {
      return record.useList?.join(', ')
    }
  },
];

export const wineColumns = [
  {
    title: '酒水名称',
    dataIndex: 'name',
  },
  {
    title: '得分',
    width: '80px',
    dataIndex: 'score',
    sorter: (a, b) => b.score - a.score,
  },
  {
    title: '价格',
    width: '80px',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price,
  },
];
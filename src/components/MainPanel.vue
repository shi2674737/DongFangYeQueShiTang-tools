<template>
  <div class="header">
    <div class="header-main">
      <div class="header-title">东方夜雀食堂小工具v1.4</div>
    </div>
  </div>
  <div class="fav-row">
    <a-row :gutter="[12, 12]">
      <a-col v-bind="wrapperCol.customer">
        <a-card class="customer-card" :bodyStyle="{padding: '12px'}">
          <template #title>
            <div style="display: flex; justify-content: space-between">
              <div>
                选择顾客
                <span class="customer-money">{{ getCustomerMoney(selectedCustomer) }}</span>
              </div>
            </div>
          </template>
          <template #extra>
            <a-button type="primary" @click="handleSetting">设置</a-button>
          </template>
          <div class="customer-list">
            <template v-for="(customer, i) in customerList
              .filter(c => customerTypes.includes(c.type))
              .filter(c => c.distanceList.filter(d => distanceTypes.includes(d)).length > 0)
              .sort((c1, c2) => c1.type.localeCompare(c2.type))" :key="i">
              <div :class="customer.name === selectedCustomer?.name ? 'selected' : ''" class="customer-item"
                   @click="handleClickCus(customer)">
                <a-image :preview="false"
                         :src="getImageUrl(customer)"
                         :alt="customer.name"
                         object-fit="contain"
                />
                <!--                {{ customer.name }}-->
              </div>
            </template>
          </div>
        </a-card>
      </a-col>
      <a-col v-bind="wrapperCol.dish">
        <a-card :bodyStyle="{padding: 0}">
          <template #title>
            <div style="display: flex; justify-content: space-between">
              <div>
                推荐菜品
              </div>
              <a-checkbox v-model:checked="showAllDish">仅显示点单</a-checkbox>
            </div>
          </template>
          <div class="fav-tag-list" v-if="selectedCustomer">
            <template v-for="tag in selectedCustomer?.favList?.filter(t => t !== '可能不全')" :key="tag">
              <a-tag class="fav-tag" :color="tag === selectedTag ? '#ffc53d' : 'orange'" @click="handleClickTag(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <template v-for="tag in selectedCustomer?.dissList?.filter(t => t !== '可能不全')" :key="tag">
              <a-tag class="fav-tag" color="red">
                X&nbsp;{{ tag }}
              </a-tag>
            </template>
          </div>
          <a-table
            rowKey="name"
            :rowClassName="stripeRow"
            :columns="dishColumns"
            :dataSource="dishDataSource.filter(data => data.hasTag || !showAllDish)"
            :pagination="false"
            :size="tableSize"
          ></a-table>
        </a-card>
      </a-col>
      <a-col v-bind="wrapperCol.wine">
        <a-card :bodyStyle="{padding: 0}">
          <template #title>
            <div style="display: flex; justify-content: space-between">
              <div>推荐酒水</div>
              <a-checkbox v-model:checked="showAllWine">仅显示点单</a-checkbox>
            </div>
          </template>
          <div class="fav-tag-list" v-if="selectedCustomer">
            <template v-for="tag in selectedCustomer?.drinkList?.filter(t => t !== '可能不全')" :key="tag">
              <a-tag class="fav-tag" :color="tag === selectedTagDrink ? '#40a9ff' : 'blue'"
                     @click="handleClickTagDrink(tag)">
                {{ tag }}
              </a-tag>
            </template>
          </div>
          <a-table
            rowKey="name"
            :rowClassName="stripeRow"
            :columns="wineColumns"
            :dataSource="wineDataSource.filter(data => data.hasTag || !showAllWine)"
            :pagination="false"
            :size="tableSize"
          ></a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model:open="showSetting" title="设置" @ok="handleOk" :width="800">
      <a-form>
        <a-form-item label="顾客类型">
          <a-checkbox-group v-model:value="customerTypes" :options="plainOptions">
            <template #label="{ label  }">
              {{ label }}
            </template>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="选择地区">
          <a-checkbox-group v-model:value="distanceTypes" :options="distanceOptions">
            <template #label="{ label  }">
              {{ label }}
            </template>
          </a-checkbox-group>
        </a-form-item>
        <!--        <a-form-item label="导入数据">
                  <a-upload
                    v-model:file-list="fileList"
                    list-type="text"
                    :max-count="1"
                    action="#"
                    :before-upload="() => false"
                  >
                    <a-button>
                      选择文件
                    </a-button>
                  </a-upload>
                </a-form-item>
                <div style="color: hotpink">需要修改人物，菜品等数据的同学可以修改目录下的 东方夜雀食堂.xlsx <a href="./东方夜雀食堂.xlsx">下载模板</a>
                  文件，修改后再进行导入。<br>刷新页面会重置为初始数据，也可以直接修改 data.js 文件永久修改数据
                </div>-->

      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {onMounted, reactive, toRefs} from "vue";
import {dishColumns, plainOptions, wineColumns} from "../utils/constants";
import {dishList, normalList, rareList, wineList} from "../utils/data-v3";
// import * as XLSX from 'xlsx';

export default {
  name: "MainPanel",
  setup() {
    const state = reactive({
      plainOptions,
      dishColumns,
      wineColumns,
      dishList,
      wineList,
      rareList,
      normalList,
      customerList: [],
      distanceOptions: [],
      popularProp: undefined,
      unpopularProp: undefined,
      wrapperCol: {
        customer: {
          xxl: 8,
          md: 24,
        },
        dish: {
          xxl: 10,
          md: 16,
        },
        wine: {
          xxl: 6,
          md: 8,
        },
      },
      selectedCustomer: undefined,
      selectedDistance: undefined,
      selectedTag: undefined,
      selectedTagDrink: undefined,
      customerTypes: ['rare'],
      distanceTypes: [],
      showAllDish: false,
      showAllWine: false,
      dishDataSource: [],
      wineDataSource: [],
      tableSize: 'normal',
      // tableSize: 'small',
      showSetting: false,
      fileList: []
    });

    const getImageUrl = (customer) => {
      return './' + customer.name + '.PNG';
    }

    const initDistance = () => {
      const distanceList = Array.from(state.customerList.filter(c => c.type === 'rare').reduce((total, rare) => total.add(...rare.distanceList), new Set()))
      state.distanceTypes = distanceList
      state.distanceOptions.push(...distanceList.map(v => ({value: v, label: v})))
      // console.log('state.distanceOptions', state.distanceOptions)
    }

    const toList = data => {
      if (data instanceof String) {
        return [data]
      } else if (data instanceof Array) {
        return data
      }
    }

    const getWeight = (data) => {
      return data.score * 1000 + parseInt(data.price);
    }

    const getFavDish = (customerName, tag = null, lessPrice = true) => {
      const customer = state.customerList.find(customer => customer.name === customerName);
      if (!customer) {
        return null;
      }
      const {favList, dissList} = customer;
      let scoreList = [];
      state.dishList
        // .filter(dish => tag ? dish.props.includes(tag) : true)
        .forEach(dish => {
          const favSet = new Set(favList)
          const dissSet = new Set(dissList)
          const like = toList(dish.props).filter(p => favSet.has(p))?.length || 0;
          const dislike = toList(dish.props).filter(p => dissSet.has(p))?.length || 0;
          scoreList.push({
            name: dish.name,
            price: dish.price,
            score: like - dislike,
            cook: dish.cook,
            useList: dish.useList,
            hasTag: tag ? dish.props.includes(tag) : false
          })
        })
      scoreList = scoreList.filter(s => s.score > 0).sort((d1, d2) => getWeight(d2) - getWeight(d1));
      const score = scoreList.length > 0 ? scoreList[0] : {};
      const favDish = state.dishList.find(dish => dish.name === score.name) || {};
      console.log('=== 推荐菜品 ===')
      console.log(`顾客: ${customer.name}\n喜好: ${customer.favList.join(',')}\n推荐菜: ${favDish.name}\n分数: ${score.score}\n价格: ${favDish.price}\n厨具: ${favDish.cook}\n材料: ${favDish.useList?.join(',')}`)
      return scoreList;
    }

    const getFavWine = (customerName, tag = null, lessPrice = true) => {
      const customer = state.customerList.find(customer => customer.name === customerName);
      if (!customer) {
        return null;
      }
      const {drinkList} = customer;
      let scoreList = [];
      state.wineList
        // .filter(wine => tag ? wine.props.includes(tag) : true)
        .forEach(wine => {
          const favSet = new Set(drinkList)
          const like = toList(wine.props).filter(p => favSet.has(p))?.length || 0;
          scoreList.push({
            name: wine.name, price: wine.price, score: like, hasTag: tag ? wine.props.includes(tag) : false
          })
        })
      scoreList = scoreList.filter(s => s.score > 0).sort((d1, d2) => getWeight(d2) - getWeight(d1));
      const score = scoreList.length > 0 ? scoreList[0] : {};
      const favWine = state.wineList.find(wine => wine.name === score.name) || {};
      console.log('=== 推荐酒水 ===')
      console.log(`顾客: ${customer.name}\n喜好: ${customer.drinkList.join(',')}\n推荐酒: ${favWine.name}\n分数: ${score.score}\n价格: ${favWine.price}\n`)
      return scoreList;
    }

    const getFavDishByDistance = (distance, types = ['normal']) => {
      let scoreList = []
      state.customerList
        .filter(customer => types.includes(customer.type) && customer?.distanceList?.includes(distance))
        .map(customer => {
          return getFavDish(customer.name);
        })
        .reduce((p, c, i) => {
          return p.concat(c)
        }, [])
        .forEach(d => {
          const score = scoreList.find(s => s.name === d.name)
          if (score) {
            score.score += d.score;
          } else {
            scoreList.push(d)
          }
        })
      scoreList = scoreList.sort((o1, o2) => o2.score - o1.score)
      // console.log(scoreList)
      return scoreList
    }

    const getFavWineByDistance = (distance, types = ['normal']) => {
      let scoreList = []
      state.customerList
        .filter(customer => types.includes(customer.type) && customer?.distanceList?.includes(distance))
        .map(customer => {
          return getFavWine(customer.name);
        })
        .reduce((p, c, i) => {
          return p.concat(c)
        }, [])
        .forEach(d => {
          const score = scoreList.find(s => s.name === d.name)
          if (score) {
            score.score += d.score;
          } else {
            scoreList.push(d)
          }
        })
      scoreList = scoreList.sort((o1, o2) => o2.score - o1.score)
      // console.log(scoreList)
      return scoreList
    }

    const handleClickCus = (customer) => {
      console.log('customer', customer)
      state.selectedCustomer = state.selectedCustomer === customer ? undefined : customer;
      state.selectedDistance = undefined;
      state.selectedTag = undefined;
      state.selectedTagDrink = undefined;
      state.dishDataSource = getFavDish(state.selectedCustomer?.name, null);
      state.wineDataSource = getFavWine(state.selectedCustomer?.name, null);
    }

    const handleClickDistance = (distance) => {
      console.log('distance', distance)
      state.selectedCustomer = undefined;
      state.selectedDistance = state.selectedDistance === distance ? undefined : distance;
      state.selectedTag = undefined;
      state.selectedTagDrink = undefined;
      state.dishDataSource = getFavDishByDistance(distance);
      state.wineDataSource = getFavWineByDistance(distance);
    }

    const handleClickTag = (tag) => {
      // console.log('tag', tag)
      state.selectedTag = state.selectedTag === tag ? undefined : tag;
      state.dishDataSource = getFavDish(state.selectedCustomer.name, tag);
    }

    const handleClickTagDrink = (tag) => {
      // console.log('tag', tag)
      state.selectedTagDrink = state.selectedTagDrink === tag ? undefined : tag;
      // console.log('state.selectedTagDrink', state.selectedTagDrink)
      state.wineDataSource = getFavWine(state.selectedCustomer.name, tag);

    }

    const stripeRow = (record, index) => {
      return record.hasTag && 'has-tag-row-striped';
    }

    const getCustomerMoney = (customer) => {
      const m = customer?.money || '';
      return m ? `${customer.name}:${m}金` : '';
    }

    const handleSetting = () => {
      state.showSetting = true
    }

    // const importExcel = () => {
    //   if (state.fileList.length > 0) {
    //     const file = state.fileList[0]
    //     if (file.name.indexOf('.xlsx') > 0) {
    //       const reader = new FileReader();
    //       reader.readAsArrayBuffer(file.originFileObj)
    //       reader.onload = e => {
    //         let data = e.target.result;
    //         const workbook = XLSX.read(data, {type: 'array'})
    //         state.customerList = []
    //         for (let i = 0; i < workbook.SheetNames.length; i++) {
    //           const name = workbook.SheetNames[i];
    //           const json = XLSX.utils.sheet_to_json(workbook.Sheets[name])
    //           const result = this.transferData(json);
    //           if (name === '料理') {
    //             state.dishList = result
    //           } else if (name === '酒水') {
    //             state.wineList = result
    //           } else if (name === '普客') {
    //             state.customerList.push(...result)
    //           } else if (name === '稀客') {
    //             state.customerList.push(...result)
    //           }
    //         }
    //         console.log('state.dishList', state.dishList)
    //         console.log('state.wineList', state.wineList)
    //         console.log('state.customerList', state.customerList)
    //         initDistance();
    //         state.fileList = [];
    //       }
    //     }
    //   }
    // }

    // const transferData = list => {
    //   return list.map(line => {
    //     // console.log('line', line)
    //     Object.keys(line).forEach(key => {
    //       let column = line[key]
    //       // console.log(key, column)
    //       if (typeof column === 'number') {
    //         return
    //       }
    //       if (column.indexOf('、') >= 0) {
    //         line[key] = column.split('、').filter(d => d)
    //       } else if (column.indexOf('－') >= 0) {
    //         line[key] = column.split('－').filter(d => d)
    //       } else if (key.indexOf('List') >= 0 || key.indexOf('props') >= 0) {
    //         line[key] = [column]
    //       }
    //     })
    //     return line
    //   })
    // }

    const handleOk = () => {
      state.showSetting = false
      //   importExcel()
    }

    onMounted(() => {
      state.customerList.push(...rareList)
      state.customerList.push(...normalList)
      initDistance()
    })

    return {
      ...toRefs(state),
      initDistance,
      getImageUrl,
      toList,
      getFavDish,
      getFavWine,
      getFavDishByDistance,
      getFavWineByDistance,
      handleClickCus,
      handleClickDistance,
      handleClickTag,
      handleClickTagDrink,
      stripeRow,
      getCustomerMoney,
      handleSetting,
      // importExcel,
      // transferData,
      handleOk,
    }
  }
}
</script>

<style>

.header {
  display: flex;
  width: 100%;
  height: 60px;
  padding: 10px 20px;
  background: #1677ff;
}

.header-main {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 40px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.fav-row {
  padding: 12px;
}

.customer-list {
  display: flex;
  flex-wrap: wrap;
}

.customer-item {
  flex-shrink: 0;
  width: 90px;
  height: 120px;
  line-height: 100px;
  margin: 2px 6px 6px 2px;
  font-size: 14px;
  text-align: center;
  white-space: normal;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.selected {
  border: 1px solid pink;
}

.customer-money {
  color: #333333;
  margin-left: 24px;
}

.fav-tag-list {
  margin: 12px 0 0 12px;
}

.fav-tag {
  width: 120px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  margin: 0 12px 12px 0;
  cursor: pointer;
}

.has-tag-row-striped {
  background: #f6ffed;
}


</style>
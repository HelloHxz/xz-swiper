import React from 'react';
import WeiChatImageItem from './wechatImageItem';
import Swiper from '../../../lib/swiper';
import './index.less';

var siwperData = [
    {src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540033535725&di=596b3b26152812377e5d8ae43689d593&imgtype=0&src=http%3A%2F%2Fwww.pptbz.com%2Fpptpic%2FUploadFiles_6909%2F201211%2F2012111719294197.jpg',title:"xxx"},
    {
      src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540033874504&di=906efcaffe2c87db0699a5917665f748&imgtype=0&src=http%3A%2F%2Fpic14.nipic.com%2F20110605%2F1369025_165540642000_2.jpg",title:"xxx",
     },
     {src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540033894084&di=9bce27dbf4e3db1bb9aceaf4503052c5&imgtype=0&src=http%3A%2F%2Fpic19.nipic.com%2F20120210%2F7827303_221233267358_2.jpg",title:"xxx"},
     {src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540033971953&di=1d5162e023a89c227a2d9e3ef58e166b&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01ca425a3a101ca801201a1f8ea667.jpg%401280w_1l_2o_100sh.jpg",title:"xxx"}
   ];
   
export default class Basic extends React.Component {
    renderSwiperItem(params){
        return ( <WeiChatImageItem
            output = {(text)=>{
                if(this.props.output){
                    this.props.output(text);
                }
            }}
            swiper={params.swiper} data={params.data}/>);
      }
    render () {
        return (
            <Swiper ref={(instance)=>{this.topswiper = instance;}} 
            style={{ height: '100%', backgroundColor:'#000' }}
            lazyrender={false} 
            loop={true} 
            data={siwperData} 
            renderItem = {this.renderSwiperItem.bind(this)}>
          </Swiper>
        );
    }
}

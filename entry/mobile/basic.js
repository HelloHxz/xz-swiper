import React from 'react';
import Swiper from '../../lib/swiper';

var siwperData = [
    {src:'1',title:"xxx"},
    {
      src:"2",title:"xxx",
     },
     {src:"3",title:"xxx"},
     {src:"4",title:"xxx"}
   ];
   
export default class Basic extends React.Component {
    renderSwiperItem(params){
        return ( <div>{params.data.src}</div>);
      }
    render () {
        return (
            <Swiper ref={(instance)=>{this.topswiper = instance;}} 
            style={{ height: 300 }}
            lazyrender={false} 
            loop={true} 
            cache={true} 
            data={siwperData} 
            renderItem = {this.renderSwiperItem.bind(this)}>
          </Swiper>
        );
    }
}

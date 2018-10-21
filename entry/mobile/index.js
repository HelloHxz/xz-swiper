import React from 'react';
import ReactDOM from 'react-dom';
import Basic from './basic';
import WeiChatPreView from './weichat/weichatpreview';
import './index.less';


const List = [
    {name:'基础用法',component:Basic,key:'baisc'},
    {name:'微信图片预览',component:WeiChatPreView,key:'weichat'}
];

class Root extends React.Component {
    constructor(props){
        super(props);
        let hash = window.location.hash;
        hash = hash.split('#');
        if(hash.length === 2) {
            hash = hash[1];
        }
        this.state = {
            hash,
            log:'',
        };
    }
    itemClick (item){
        window.location.hash="#"+item.key; 
        this.setState({
            hash:item.key,
        });
    }
    render () {
        let re = [];
        for(let i = 0,j = List.length;i<j;i+=1) {
            const item = List[i];
            re.push(<div onClick={this.itemClick.bind(this,item)} className='demo-item'>
                {item.name}
            </div>);
            if(item.key === this.state.hash) {
                const Com = item.component;
                re = <Com output={(text)=>{
                    this.setState({
                        log:text
                    });
                }} />;
                break;
            }
        }
        return <React.Fragment>
            <div style={{zIndex:111,position:'absolute',top:0,left:0,color:'#fff'}} >
            {this.state.log}
            </div>
        {re}</React.Fragment>;
    }
}

ReactDOM.render(
	<Root/>,
	document.getElementById('xz-lightapp-root'));
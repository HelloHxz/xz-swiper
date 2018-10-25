import React from 'react';

export default class WeiChatImageItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            image: null,
            imageStyle: {
            },
            left:0,
            top:0,
            scale: 1
        }
        this.wrapperWidth = document.body.offsetWidth;
        this.wrapperHeight = document.body.offsetHeight;
    }
    componentDidMount(){
        this.loadImage();
    }
    loadImage() {
        var image = new Image();
        var _this = this;
        var src = this.props.data.src;
        if(!src){return;}
        image.onload = function(){
          _this.loadSuccess(image,src);
        }
        image.onerror = function(){
          _this.renderDefault();
        }
        //靠！！！解决safri 回退BUG
        setTimeout(()=>{
          image.src = src;
        },0)
    }
    loadSuccess(image,src){
        var style = {};
        if(image.width>image.height){
            style.width =image.width>this.wrapperWidth ? this.wrapperWidth:image.width;
          }else{
            style.height = image.height>this.wrapperHeight? this.wrapperHeight:image.height;
        }
        style.scale = 1;
        this.setState({
            imageStyle:style,
        });
    }
    getDistanceBetweenTwoPointer(e) {
        const first = e.touches[0];
        const second = e.touches[1];
        return this.getDistance(first.pageX,first.pageY,second.pageX,second.pageY);
    }
    getDistance(x1,y1,x2,y2){
        const xdiff = x1 - x2;
        const ydiff = y1 - y2;
        return Math.sqrt((xdiff * xdiff) + (ydiff * ydiff))
    }
    getMiddlePointBetweenTwpPointer(e) {
        const first = e.touches[0];
        const second = e.touches[1];
        return { x: (first.pageX + second.pageX)/2, y:(first.pageY + second.pageY)/2};
    }
    onTouchStart(e){
        this.originImageStyle = JSON.parse(JSON.stringify(this.state.imageStyle));
        this.originScale = this.state.scale;
        this.originLeft = this.state.left;
        this.originTop = this.state.top;
        this.enableSingeFingerAction = true;
        this.imageRect =  this.img.getBoundingClientRect();
        this.fingerCount = 1;
        if(e.touches.length === 2) {
            this.enableSingeFingerAction = false;
            this.fingerCount = 2;
            this.twoFingerMiddlePointer = this.getMiddlePointBetweenTwpPointer(e);
            this.imageFocusPointer = {
                x: (this.twoFingerMiddlePointer.x- this.imageRect.left)/this.originScale,
                y: (this.twoFingerMiddlePointer.y - this.imageRect.top)/this.originScale,
            };
            this.orignDistance = this.getDistanceBetweenTwoPointer(e);
        } else {
            this.singleFingerPointer = e.touches[0];
        }
    }
    onTouchMove(e){
        e.preventDefault();
        const curIS = JSON.parse(JSON.stringify(this.state.imageStyle));
        if(this.originScale>1){
            this.props.swiper.toggleEnableGoPre(false);
            this.props.swiper.toggleEnableGoNext(false);
        }else {
            this.props.swiper.toggleEnableGoPre(true);
            this.props.swiper.toggleEnableGoNext(true);
        }
        this.isHasTouchMove = false;
        if(e.touches.length === 2) {
            this.fingerCount = 2;
            this.enableSingeFingerAction = false;
            const curDistance = this.getDistanceBetweenTwoPointer(e);
            const scaleSeed= (curDistance-this.orignDistance)/(this.orignDistance*3);
            this.originScale += scaleSeed;
            this.originScale = this.originScale<0.6? 0.6:this.originScale;
            this.originScale = this.originScale>8? 8:this.originScale;
            this.scaleWithMiddlePointer(this.imageFocusPointer,this.originScale,curIS);
        } else {
            if(!this.enableSingeFingerAction ){
                return;
            }
            this.fingerCount = 1;
            if(this.state.scale>1){
                const rect =  this.img.getBoundingClientRect();
                const curSingleFingerPointer = e.touches[0];
                this.isHasTouchMove = true;
                if(curSingleFingerPointer.pageX>this.singleFingerPointer.pageX){
                    // 向右
                    if(this.props.output){
                        this.props.output(rect.left);
                    }
                    if(rect.left>0){
                        return;
                    }
                }else{
                    // 向左
                    if(rect.right<document.body.offsetWidth){
                        return;
                    }
                }
                const diffX = curSingleFingerPointer.pageX - this.singleFingerPointer.pageX;
                const diffY = curSingleFingerPointer.pageY - this.singleFingerPointer.pageY;
                const curLeft  = this.originLeft + diffX;
                const curTop  = this.originTop + diffY;
                curIS.transform ='scale('+(this.state.scale)+') translate('+(curLeft)+'px,'+(curTop)+'px)';
                this.setState({
                    imageStyle: curIS,
                    left:curLeft,
                    top:curTop,
                });
               
            }
            
        }
    }
    onTouchEnd(){
        if(this.originScale>1){
            this.props.swiper.toggleEnableGoPre(false);
            this.props.swiper.toggleEnableGoNext(false);
        }else {
            this.props.swiper.toggleEnableGoPre(true);
            this.props.swiper.toggleEnableGoNext(true);
        }
        if(this.fingerCount===2) {
            this.fingerCount = 1;
            if(this.state.scale < 1) {
                this.reset();
            }
        } else if(this.fingerCount === 1) {
            if(this.singleFingerPointer) {
                if(this.beforeSingleFingerPointer) {
                    if(Math.abs(this.beforeSingleFingerPointer.pageX-this.singleFingerPointer.pageX) < 5 && Math.abs(this.beforeSingleFingerPointer.pageY-this.singleFingerPointer.pageY) < 5) {
                        this.beforeSingleFingerPointer = null;
                        if(this.doubleClickTimeout) {
                            clearTimeout(this.doubleClickTimeout);
                            this.doubleClickTimeout = null;
                        }
                        this.doubleClick(this.singleFingerPointer);
                    }
                } else {
                    this.beforeSingleFingerPointer = this.singleFingerPointer;
                    if(this.doubleClickTimeout) {
                        clearTimeout(this.doubleClickTimeout);
                        this.doubleClickTimeout = null;
                    }
                    this.doubleClickTimeout = setTimeout(() => {
                        this.beforeSingleFingerPointer = null;
                        if(!this.isHasTouchMove){
                            this.reset();
                        }
                    }, 200);
                }
                
            }
        }
        if(this.enableSingeFingerAction === false) {
            if(this.clearTimeoutId){
                window.clearTimeout(this.clearTimeoutId);
                this.clearTimeoutId = null;
            }
            this.clearTimeoutId = window.setTimeout(()=>{
                this.enableSingeFingerAction = true;
            },600);
        }
    }
    doubleClick(pointer) {
        const curIS = JSON.parse(JSON.stringify(this.state.imageStyle));
        this.scaleWithMiddlePointer({x:pointer.pageX,y:pointer.pageY} ,1.5 ,curIS);
    }
    scaleWithMiddlePointer(pointer,scale,curIS) {
        console.log(scale);
        curIS.transform ='scale('+(scale)+') translate(0,0)';
        curIS.transformOrigin = pointer.x+'px '+pointer.y+'px';
        this.setState({
            imageStyle: curIS,
            scale,
        });
    }
    imageClick(){
     
    }
    reset() {
        const curIS = JSON.parse(JSON.stringify(this.state.imageStyle));
        curIS.transform ='scale(1) translate(0,0)';
        this.setState({
            imageStyle: curIS,
            scale:1,
            // left:0,
            // top:0,
        });
    }
    render (){
        const { data } = this.props;
        const src = data.src;
        var toucheEvent = {};
        toucheEvent.onTouchStart = this.onTouchStart.bind(this);
        toucheEvent.onTouchMove = this.onTouchMove.bind(this);
        toucheEvent.onTouchEnd = this.onTouchEnd.bind(this);
        return (
        <div {...toucheEvent} className='xz-weichat-item'>
            { this.state.imageStyle ? <img onClick={this.imageClick.bind(this)} className='xz-weichat-image' ref={(img) => {this.img = img;}} style={this.state.imageStyle} src={src}/> : null}
        </div>);
    }
}
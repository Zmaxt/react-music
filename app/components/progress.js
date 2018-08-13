import React from 'react'
import "./progress.less"

let Progress = React.createClass({
    // 设置默认props
    getDefaultProps(){
        return {
            barColor:'yellow'
        }
    },
    changeProgress(e){
        let progressBar = this.refs.progressBar;//获取dom节点
        // getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
        let progress = (e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;//百分比
        // 判断函数是否存在之后再调用
        this.props.onProgressChange && this.props.onProgressChange(progress)
    },
    render(){
        return (
            <div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
               <div className="progress" 
               style={
                   {
                    width:`${this.props.progress}%`,
                    background:this.props.barColor
                    }
                }></div>
            </div>
        )
    }
})
export default Progress;
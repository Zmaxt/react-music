import React  from 'react'
import Progress from '../components/progress'
import "./player.less"
import {Link} from "react-router"
import Pubsub from 'pubsub-js'//事件订阅，事件管理器

let duration = null;
let Player = React.createClass({
    getInitialState(){
        return{
            progress: 0,//初始状态,
            volume: 0,
            isPlay:true,//记录是否播放状态
            leftTime:''
        }
    },
    formateTime(time){
        time = Math.floor(time);
        let minutes = Math.floor(time / 60);
        let seconds =  Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`;
    },
    componentDidMount(){
        // 绑定事件
        $('#player').bind($.jPlayer.event.timeupdate,(e)=>{
           
            duration = e.jPlayer.status.duration;//总时间
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress:e.jPlayer.status.currentPercentAbsolute,
                leftTime: this.formateTime(duration * (1-e.jPlayer.status.currentPercentAbsolute/100))
            })
        })
    },
    // 解绑事件 生命周期 组件即将被销毁
    componentWillUnmount(){
        $('#player').unbind($.jPlayer.event.timeupdate);
    },
    progressChangeHandler(progress){
       $('#player').jPlayer('play',duration * progress)
    },
    changeVolumeHandler(progress){
        $('#player').jPlayer('volume',progress)
    },
    play(){
        if(this.state.isPlay){
            console.log("ssss")
            $('#player').jPlayer('pause');
        }else{
            $('#player').jPlayer('play');
        }
        // 更新状态
        this.setState({
            isPlay: !this.state.isPlay
        })
    },
    playPrev(){
        Pubsub.publish('PLAY_PREV')
    },
    playNext(){
        Pubsub.publish('PLAY_NEXT')
    },
    changeRepeat(){
        Pubsub.publish('CHANGE_REPEAT')
    },
    render(){
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20" style={{float:'left',width:'450px'}}>
                    <div className="controll-wrapper" style={{width:'100%'}}>
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h2 className="music-artist mt10">{this.props.currentMusicItem.artist}</h2>
                        <div className="row mt20">
                            <div className="left-time -col-auto">{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top:5,left:10}}></i>
                                <div className="volume-wrapper" style={{marginLeft:20,width:100}}>
                                <Progress
                                    progress={this.state.volume}
                                    onProgressChange = {this.changeVolumeHandler}
                                    barColor="yellow"
                                >
                                </Progress>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{height:10,lineHeight:'10px',width:'100%'}}>
                        {/* progressChangeHandler自身组件的一个方法 */}
                        <Progress
                            progress={this.state.progress}
                            onProgressChange = {this.progressChangeHandler}
                            barColor="green"
                        >
                        </Progress>
                    </div>
                    <div className="mt35 row" style={{width:'100%'}}>
                        <div style={{width:'50%'}}>
                            <i className="icon prev" onClick={this.playPrev}></i>
                            <i className={`icon ml20 ${this.state.isPlay ?'pause':'play'}`} 
                            onClick = {this.play}
                            ></i>
                            <i className="icon next ml20"  onClick={this.playNext}></i>
                        </div>
                        <div className="-col-auto" style={{width:'50%'}}>
                            <i className={`icon repeat-${this.props.repeatType}`} style={{float:'right',}} onClick={this.changeRepeat}></i>
                        </div>  
                    </div>
                </div>
                <div className="-col-auto cover" style={{float:'left',width:'200px'}}>
                    <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} />
                </div>
                    
                 
            </div>
           
        )
    }
})
export default Player;
// 页面管理
import React from 'react'
import Header from './components/header'
import Player from './page/player';
import MusicList from './page/musiclist';
import { MUSIC_LIST } from './config/musiclist'//导出MUSIC_LIST没有进行defaul操作。所以要加大括号
import {Router,IndexRoute,Link,Route,hashHistory} from 'react-router' //用npm安装，不用写相对路径
import Pubsub from 'pubsub-js'//事件订阅，事件管理器

let App = React.createClass({
    getInitialState(){
        return{
            musiclist:MUSIC_LIST,
            currentMusicItem :MUSIC_LIST[2],
            repeatType:'cycle'
        }
    },
    playMusic(musicItem){
       
        $('#player').jPlayer('setMedia',{
            mp3: musicItem.file
        })
         .jPlayer('play');//立即播放
        this.setState({
            currentMusicItem: musicItem
        
        })

    },
    playNext(type = "next"){
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let newindex = null;
        let musiclistLength = this.state.musiclist.length;
        if(type == 'next'){
            newindex = (index + 1) % musiclistLength //防止数组溢出好办法
        }else{
            newindex = (index - 1 + musiclistLength) % musiclistLength //排除index为0的情况，所以要加个length
        }
        this.playMusic(this.state.musiclist[newindex])
    },
    findMusicIndex(musicItem){
        return this.state.musiclist.indexOf(musicItem);
    },
    playWhenEnd(){
        if(this.state.repeatType == 'random'){
            let index = this.findMusicIndex(this.state.currentMusicItem);
            let randomIndex =  Math.floor(Math.random()*this.state.musiclist.length-1);
            while(randomIndex == index){
                randomIndex = Math.floor(Math.random()*this.state.musiclist.length-1);
            }
            this.playMusic(this.state.musiclist[randomIndex])
        }else if(this.state.repeatType == 'once'){
            this.playMusic(this.state.currentMusicItem)
        }else{
            this.playNext();
        }
    },
    componentDidMount(){
        // 初始化，简单配置
        $('#player').jPlayer({
            supplied:'mp3',//支持播放格式
            wmode:'window'
        });
     
        this.playMusic(this.state.currentMusicItem)//播放
        // 监听播放完后，播放下一曲
        $('#player').bind($.jPlayer.event.ended,(e)=>{
            // this.playNext();
            this.playWhenEnd();
        })
        // 绑定事件
        Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
            this.setState({
                musiclist: this.state.musiclist.filter(item =>{
                    return item != musicItem
                })
            })
        });
        Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
            this.playMusic(musicItem)//播放
        });
        Pubsub.subscribe('PLAY_PREV',(msg,musicItem)=>{
            this.playNext('prev')//上一曲
        });
        Pubsub.subscribe('PLAY_NEXT',(msg,musicItem)=>{
            this.playNext('next')//下一曲
        });
        let repeatList = [
            'cycle',
            'random',
            'once'
        ];
        Pubsub.subscribe('CHANGE_REPEAT',()=>{
            let index = repeatList.indexOf(this.state.repeatType);
            index = (index+1) % repeatList.length;
            this.setState({
                repeatType:repeatList[index]
            })
        });
    },
    // 解绑事件 生命周期 组件即将被销毁
    componentWillUnmount(){
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('PLAY_PREV');
        Pubsub.unsubscribe('PLAY_NEXT');
        Pubsub.unsubscribe('CHANGE_REPEAT');
        $('#player').unbind($.jPlayer.event.ended)
    },
    render(){
        return (
            <div>
                <Header />
                {/* 大括号包裹表示可执行表达式 */}
                {React.cloneElement(this.props.children, this.state)}
              
                {/* <Player
                    currentMusicItem = {this.state.currentMusicItem}
                >
                </Player> 
                <MusicList
                    currentMusicItem={this.state.currentMusicItem}//当前播放歌曲
                    musiclist={this.state.musiclist}//列表
                    ></MusicList> */}
            </div>
           
        )
    }
})

let Root = React.createClass({
    render(){
        return(
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                {/* 控制两个页面 */}
                    <IndexRoute component={Player}></IndexRoute>
                    <Route path="/list" component={MusicList}></Route>
                </Route>
            </Router>
        )
        
    }
})
export default Root;
import React from 'react'
import './musiclistitem.less'
import Pubsub from 'pubsub-js'//事件订阅，事件管理器

let MusicListItem = React.createClass({
    playMusic(musicItem){
        PubSub.publish('PLAY_MUSIC',musicItem);//发布事件
    },
    deleteMusic(musicItem,e){
        e.stopPropagation();//阻止冒泡。。
        PubSub.publish('DELETE_MUSIC',musicItem);//发布事件
    },
    render(){
        let musicItem = this.props.musicItem;
        return (
            // bind(绑定作用域，传参参数)
            <li onClick={this.playMusic.bind(this,musicItem)} className={`components-musiclistitem ${this.props.focus?'focus':''}`}>
                <p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
                <p className="-col-auto delete" onClick={this.deleteMusic.bind(this,musicItem)}></p>
            </li>
        )
    }
})

export default MusicListItem;
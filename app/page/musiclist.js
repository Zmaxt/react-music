import React from 'react'
import MusicListItem from '../components/musiclistitem'
let MusicList = React.createClass({
    render(){
        let listEle = null;
        listEle = this.props.musiclist.map((item)=>{
            return (
                <MusicListItem 
                    key={item.id}
                    musicItem = {item}
                    focus = {item==this.props.currentMusicItem}
                    >
                   
                </MusicListItem>
            )
        });
        return (
            <ul>{listEle}</ul>
        )
    }
});

export default MusicList;
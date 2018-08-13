// var react = require('react');
import React from 'react'
import { render } from 'react-dom'; //render方法把 react 组件挂载到真实DOM元素上
import { AppContainer } from 'react-hot-loader'; //需要变换哪一部分组件
import Root from './Root';

render(
	<AppContainer>
		<Root />
	</AppContainer>,
	document.getElementById('root')
	);
	// 热更新相关配置
if(module.hot){
	module.hot.accept('./Root',()=>{
		const NewRoot = require('./Root').default;
		render(
			<AppContainer>
				<NewRoot />
			</AppContainer>,
			document.getElementById('root')
		);
	})
}
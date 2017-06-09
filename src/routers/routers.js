import React from 'react';
import Bundle from '../pages/Bundle';
import { Route } from 'react-router-dom';

let links = {
    dashboard: require("bundle-loader?lazy!../pages/dashboard/dashboard.js"),
    button: require("bundle-loader?lazy!../pages/Button/index.js"),
    checkbox: require("bundle-loader?lazy!../pages/CheckBox/checkbox.js"),
};

let ret = [];
for(let load in links){
    const Comp = () => (
      <Bundle load={links[load]}>
        {(Mod) => <Mod/>}
      </Bundle>
    )
    ret.push(<Route key={load} path={"/"+load} component={Comp}></Route>);
}

export default ret;

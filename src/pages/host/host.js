import React from 'react';


class Page extends React.Component{
    render(){
        return (
            <div>
                <div class="cm-breadcrumb">
                    <span>
                        <span class="cm-breadcrumb-link">资产管理</span>
                        <span class="cm-breadcrumb-separator">/</span>
                    </span>
                    <span>
                        <span class="cm-breadcrumb-link">主机资产管理</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default Page;

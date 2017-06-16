const React = require("react");
const Table = require("Table2");
const Pagination = require("Pagination");
const jQuery = require("jquery");

class SimpleListPage extends React.Component{

    constructor(props){
        super(props);
        this.sort = {};
    }

    getSearchParams(page, pageSize){
        let params = {
            pageNum: page,
            pageSize: pageSize
        };

        let sort = [];
        for(let key in this.sort){
            if(this.sort[key]){
                sort.push(key + " "+ this.sort[key]);
            }
        }
        if(sort.length){
            params["sort"] = sort.join(",");
        }

        var searchClazz = this.props.searchClass || "searchItem";

        jQuery("."+searchClazz).each(function(){
            let name = $(this).attr("name");
            let value = $(this).val();
            if($(this).attr("type") == "radio"){
                value = $("input[name='"+name+"']:checked").val();
            }
            if(value != "") {
                params[name] = value;
            }
        });

        return params;
    }

    search(page, pageSize){
        var scope = this;
        $.ajax({
            url: this.props.action,
            type: "get",
            dataType: "json",
            data: this.getSearchParams(page, pageSize)
        }).then(function(ret){
            scope.refs.table.setData(ret.data);
            if(scope.refs.pagination) {
                scope.refs.pagination.update({total: ret.total, current: ret.pageNum, pageSize: ret.pageSize});
            }

            if(scope.props.afterRequest){
                scope.props.afterRequest();
            }
        }).fail(function(){
            console.log("get Table Data error!");
        });
    }

    componentDidMount(){
        this.search(1, 10);
        var searchBtn = this.props.searchBtn || $("#search-btn");
        var scope = this;
        $(searchBtn).on("click", function(){
            let pageSize = 10;
            if(scope.refs.pagination) {
                pageSize = scope.refs.pagination.state.pageSize;
            }
            scope.search(1, pageSize);
        });
    }

    refresh(){
        let pageSize = 10;
        let current = 1;
        if(this.refs.pagination) {
            pageSize = this.refs.pagination.state.pageSize;
            current = this.refs.pagination.state.current;
        }
        this.search(current, pageSize);
    }

    getData(){
        return this.refs.table.getData();
    }

    setData(data){
        this.refs.table.setData(data);
    }

    getTable(){
        return this.refs.table;
    }

    checkRows(ids){
        ids.forEach(function(id){
            this.checkRow(id);
        }, this);
    }

    checkRow(field, value){
        this.refs.table.checkRow(field, value);
    }

    sortColumn(column, type){
        this.sort[column.name] = type;
        this.refresh();
    }

    render(){
        return (
            <div>
                <Table ref="table" columns={this.props.columns} onSort={this.sortColumn.bind(this)} data={this.props.data || []} bordered={true} hover={true} striped={true}></Table>

                <div className="cm-row">
                {
                    this.props.pagination ? <Pagination className="pull-right" ref="pagination" current={1} pageSize={10} total={0} onChange={this.search.bind(this)} onShowSizeChange={this.search.bind(this)}></Pagination> : null
                }
                </div>
            </div>
        );
    }
}

module.exports = SimpleListPage;

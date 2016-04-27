import React, {
    Component,
} from 'react';

import '../styles/Search.scss';

export default class Search extends Component {

    _onSearchClick (evt) {
        this.props.onSearch(this.keyword.value);
    }

  	render () {
  		  let { target } = this.props;

        return (
          <div className="search-wrapper">
              <input ref={(view)=> this.keyword = view} type="text" placeholder={`输入${target}名称进行搜索`} />
              <span onClick={this._onSearchClick.bind(this)}>搜索</span>
          </div>
        );
  	}
}

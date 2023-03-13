import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        activeClass: ''
    }

    marvelService = new MarvelService();

    onCharsLoaded = (chars) => {
        this.setState({ chars, loading: false })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onToggleClass = (name) => {
        this.setState({
            activeClass: name
        })
    }

    componentDidMount() {
        this.marvelService
            .getAllCharacter()
            .then(this.onCharsLoaded)
            .catch(this.onError)

    }

    arrCharRender(arr) {
        const items = arr.map(item => {
            let imgStyle = { objectFit: 'cover' };
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = { objectFit: "unset" }
            }

            let toggleClass = "char__item"

            if (this.state.activeClass === item.name) {
                toggleClass += " char__item_selected"
            }

            return (
                <li onClick={() => this.onToggleClass(item.name)} className={toggleClass} key={item.name}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { chars, loading, error } = this.state

        const lists = this.arrCharRender(chars)

        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner /> : null
        const content = !(loading || error) ? lists : null


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}



export default CharList;
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
        activeClass: '',
        active: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,

    }

    marvelService = new MarvelService();

    componentDidMount() {
        if (this.state.offset < 219) {
            this.addChar();
        }
        window.addEventListener("scroll", this.onScroll);
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll = () => {
        if (this.state.offset < 219) return;
        if (this.state.newItemLoading) return;
        if (this.state.charEnded){
            window.removeEventListener("scroll", this.onScroll);
        }

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            this.onCharListLoading();
            this.addChar(this.state.offset);
        }
    };

    onCharsLoaded = (newChars) => {
        let ended = false
        if (newChars.length < 9) {
            ended = true
        }
        this.setState(({ offset, chars, }) => ({  //колбек функуия нужна тогда когда есть зависимость нового состояния от предидущего
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    addChar = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacter(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onToggleClass = (name, id) => {
        this.props.onCharSelect(id)
        this.setState({
            activeClass: name,
            active: !this.state.active
        })

    }
    //test
    arrCharRender(arr) {
        const items = arr.map(item => {
            let imgStyle = { objectFit: 'cover' };
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = { objectFit: "unset" }
            }
            let toggleClass = "char__item"


            if (this.state.activeClass === item.name && this.state.active === true) {
                toggleClass += " char__item_selected"
            }

            return (
                <li onClick={() => this.onToggleClass(item.name, item.id)} className={toggleClass} key={item.id}>
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
        const { chars, loading, error, offset, newItemLoading } = this.state

        const lists = this.arrCharRender(chars)

        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner /> : null
        const content = !(loading || error) ? lists : null


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={this.addChar(offset)}
                    style={{ "display": this.state.charEnded ? 'none' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}



export default CharList;
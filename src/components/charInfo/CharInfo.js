import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from "../skeleton/Skeleton"

class CharInfo extends Component {
    state = {
        char: null, //null здесь нужен что бы заработал шаблон skeleton
        loading: false,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedChar !== prevProps.selectedChar) {
            this.updateChar()
        }
    }

    onCharLoaded = (char) => {
        const clarifications = char.description ? `${char.description.slice(0, 210)}...` : "This character has no description."
        this.setState({
            char: { ...char, description: clarifications },
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = this.props.selectedChar
        if (!id) {
            return;
        }
        this.setState({
            loading: true
        })
        this.marvelService
            .getCharactar(id)
            .then(this.onCharLoaded)
            .catch(this.onError)

    }

    render() {
        const { char, loading, error } = this.state

        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner /> : null
        const content = !(loading || error || !char) ? <View char={char} /> : null

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char

    const lenghtForComics = (arr) => {
        let newLen = []
        if (arr.length >= 10) {
            for (let i = 0; i < 10; i++) {
                newLen.push(arr[i])
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                newLen.push(arr[i])
            }
        }
        return newLen
    }

    let imgStyle = { objectFit: 'cover' };
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = { objectFit: "unset" }
    }

    const emptyComics = comics.length ? null : "There is no comics about that hero"

    return (
        <>
            <div className="char__basics">
                <img style={imgStyle} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {emptyComics}
                {
                    lenghtForComics(comics).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;
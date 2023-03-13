import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from "../errorMessage/ErrorMessage"
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
   
    state = {
        char:{},
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.updateChar()
    }

    onCharLoaded = (char) =>{
        const clarifications = char.description ? `${char.description.slice(0, 210)}...` : "This character has no description."
        this.setState({char: {...char, description:clarifications}, loading: false})
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400-1011000) + 1011000);
        this.setState({
            loading: true
        })
        this.marvelService
            .getCharactar(id)
            .then(this.onCharLoaded)  //Если мы используем просто ссылку на функцию, то тот аргумент который приходит по цепочки then автоматически подставляеться
            .catch(this.onError)
            
    }

    render(){
        const {char, loading, error} = this.state //или же на курсах был иной формат  const { char: {name, description,thumbnail,homepage,wiki}} = this.state
        
        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || error) ?  <View char={char}/> : null

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
   
    const {name, description,thumbnail,homepage,wiki} = char
    
    const newImg = thumbnail.path + thumbnail.extension  === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"?  <img src={thumbnail} alt="Random character" className="randomchar__img"/> :  <img src={thumbnail} alt="Random character"  style={{objectFit: "contain", width: "180px", height: "180px"}}/>

    return(
        <div className="randomchar__block">
        {newImg}
             <div className="randomchar__info">
                   <p className="randomchar__name">{name}</p>
                   <p className="randomchar__descr">
                   {description}
                   </p>
                   <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki}className="button button__secondary">
                         <div className="inner">Wiki</div>
                     </a>
                  </div>
             </div>
        </div>
    )
}

export default RandomChar;
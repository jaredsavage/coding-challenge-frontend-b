import React            from 'react';import {render}         from 'react-dom';import $                from 'jquery';import moment           from 'moment';import ReactTooltip     from 'react-tooltip'import API              from './API.jsx';import Icon             from './Icon.jsx';import IconToggle       from './IconToggle.jsx';import DepartureList    from './DepartureList.jsx';import CountDownBanner  from './CountDownBanner.jsx';import SplashBackground from './SplashBackground.jsx';class App extends React.Component {	constructor(props) {		super(props);		this.state = {			initialized: false		}	}	componentDidMount() {		API			.fetchConfig()			.then(function(config) {								this.setState({					config: config,					initialized: true				});				document.head.title				document.body.style.backgroundImage = `url(${window.location+this.state.config.style.background.src})`;			}.bind(this))			.catch(function(err) {				//Insert error handling magic here			}.bind(this));		//Helps to keep us looking at useful things when the window resizes, or when we refresh the page.		$(window)			.resize(function() {				this.setViewPosition()			}.bind(this))			.on('beforeunload', this.setViewPosition)		  this.setViewPosition();				}	setViewPosition() {				let isMobile = (window.innerWidth <= 767);		//Transition gate		if(this.state.isMobile !== isMobile) {			this.setState({isMobile: isMobile});			let scrollTop = (isMobile ? 0 : window.innerHeight - 100 : 0);			document.body.scrollTop = scrollTop;			document.documentElement.scrollTop = scrollTop;		}			}	render () {				if(!this.state.initialized) {			return <div className="initializing"/>		} else {			let videoPresent    = (this.state.config.video ? ' videoPresent' : ''),			    responsiveClass = (this.state.isMobile     ? ' mobile'       : ' desktop'),			    headerText      = (this.state.config.strings.DEPARTURES_HEADER.replace('${DEPARTURE_DATE}', moment(this.state.config.departureDate).locale(this.state.config.locale).format('ll'))),			    logoStyle       = {backgroundImage : `url(${window.location+this.state.config.style.logo.src})`};						return (				<div className={'locale-' + this.state.config.locale + videoPresent + responsiveClass}>										{!this.state.config.video ? false : 						<SplashBackground video={this.state.config.video} disabled={this.state.isMobile} />					}										<div id="main">					<ReactTooltip id='ToolTip' effect='solid' />						<header>							<div className="logo" style={logoStyle}></div>							<CountDownBanner 								config={this.state.config} 								endTime={this.state.config.eventStartTime} 							/>														{!this.state.config.strings.TAG_LINE ? false :								<div className="tagLineBanner">									{this.state.config.strings.TAG_LINE}								</div>							}						</header>												<section>							<div className="listHeader">								{headerText}							</div>							<DepartureList 								config={this.state.config}							/>						</section>												<footer>							<div className="row">								<div className="col-xs-12 logo">																	</div>							</div>							<div className="row">								<div className="col-xs-12">									<div className="text">										<a href="http://builtinmtl.com" target="_blank" rel="nofollow">{this.state.config.strings.BUILT_IN_MONTREAL}</a> | {this.state.config.strings.PAGE_FOOTER_TEXT}									</div>								</div>							</div>						</footer>					</div>								</div>			);		}	}}render(<App />, document.getElementById('app'));
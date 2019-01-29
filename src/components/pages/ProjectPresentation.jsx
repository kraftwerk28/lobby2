import React, { Component } from 'react';
import MDParser from 'markdown-it';
import mdEmoji from 'markdown-it-emoji';
import twemoji from 'twemoji';
// import RT from 'react-twemoji';

import Button from '../Button';
import Loader from '../LoadIndicator';

import octocatIcon from '../../assets/octocat.png';
import npmIcon from '../../assets/npm.png';
import linkIcon from '../../assets/link.png';
import youtubeIcon from '../../assets/youtube.png';
// import Ripple from '../Ripple';

const md = new MDParser();
md.use(mdEmoji);
md.renderer.rules.emoji = (token, idx) =>
  twemoji.parse(token[idx].content);

md.renderer.rules.text = (token, idx) => `<span>${token[idx].content}<span>`

// const mdRenderers = {
//   image: (props) => <img {...props}></img>
// };


export default class ProjectPresentation extends Component {
  state = {
    data: {},
    dataLoaded: true,
    description: '',
  };

  constructor(props) {
    super(props);
    if (props.data.readme) {
      fetch(props.data.readme)
        .then(d => d.text())
        .then(mdData => {
          this.setState({
            // dataLoaded: true,
            description: md.render(mdData),
          });
        });
    }

    // if (props.jsonDataPath) {
    //   fetch(props.jsonDataPath)
    //     .then(d => d.json())
    //     .then(d => {
    //     });
    // }
  }

  render() {
    // const { githubUrl, npmUrl, siteUrl, youtubeUrl } = this.state.data;
    const { githubUrl, npmUrl, siteUrl, youtubeUrl } = this.props.data;

    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
        }}
      >
        {this.state.dataLoaded ? <>

          {
            this.props.children && this.props.children
          }
          <div className='top-links'>
            {githubUrl &&
              <Button
                href={githubUrl}
                transparent
                rounded
              >
                <img src={octocatIcon} className='top-link-btn' />
              </Button>
            }
            {npmUrl &&
              <Button
                href={npmUrl}
                transparent
                rounded
              >
                <img src={npmIcon} className='top-link-btn' />
              </Button>
            }
            {siteUrl &&
              <Button
                href={siteUrl}
                transparent
                rounded
              >
                <img src={linkIcon} className='top-link-btn' />
              </Button>
            }
            {youtubeUrl &&
              <Button
                href={youtubeUrl}
                transparent
                rounded
              >
                <img src={youtubeIcon} className='top-link-btn' />
              </Button>
            }
          </div>
          {this.state.description ?
            <div
              className='md-desc'
              dangerouslySetInnerHTML={{ __html: this.state.description }}
            />
            : <h3>{'no description provided :L'}</h3>
          }

        </> : <Loader />}

      </div>
    );
  }

}
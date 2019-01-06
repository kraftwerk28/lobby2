import React, { Component } from 'react';
import MDParser from 'markdown-it';
// import { Emojione as EmojiRender, Emojione } from 'react-emoji-render';

import Button from '../Button';
import Loader from '../LoadIndicator';

import octocatIcon from '../../assets/octocat.png';
import npmIcon from '../../assets/npm.png';
import linkIcon from '../../assets/link.png';
import youtubeIcon from '../../assets/youtube.png';

const md = new MDParser();

export default class ProjectPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataLoaded: false,
      description: '',
    }

    if (props.jsonDataPath) {
      fetch(props.jsonDataPath)
        .then(d => d.json())
        .then(d => {
          this.setState({ data: d, dataLoaded: true });

          if (d.readme) {
            fetch(d.readme)
              .then(d => d.text())
              .then(mdData => {
                this.setState({ description: md.render(mdData) });
              });
          }
        });
    }
  }

  render() {
    const { githubUrl, npmUrl, siteUrl, youtubeUrl } = this.state.data;

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
            /> : <h3>{'no description provided :L'}</h3>
          }

        </> : <Loader />}

      </div>
    );
  }

}
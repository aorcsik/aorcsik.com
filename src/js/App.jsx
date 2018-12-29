/* global $ */

import React from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
// import classNames from "classnames";
import { Button, CssBaseline, Divider, Grid, Switch, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { SocialIcon } from "react-social-icons";

import Post from "./Post.jsx";


const styles = theme => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2
  }
});

class App extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      mounted: false,
      loaded: false,
      content: null,
      rendered: 0,
      language_en: false
    };

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.updateListPosition = this.updateListPosition.bind(this);
  }

  componentDidMount() {
    this.setState({
      mounted: true,
      width: $(window).width()
    });
    this.request = $.getJSON("content.json", function(data) {
      this.setState({
        loaded: true,
        content: data
      });
    }.bind(this));

    var loadOnScroll = null;
    $(window).scroll(function() {
      this.updateListPosition();

      if ($("#load-more-button").length > 0 && $(window).scrollTop() + $(window).height() > $("#load-more-button").offset().top) {
        window.clearTimeout(loadOnScroll);
        loadOnScroll = window.setTimeout(function() {
          $("#load-more-button button").click();
        }, 200);
      }
    }.bind(this));

    window.setInterval(function() {
      this.updateListPosition();
    }.bind(this), 200);
  }

  // FUNCTIONS

  loadMorePosts(rendered) {
    return function() {
      this.setState({
        rendered: rendered,
      });
    }.bind(this);
  }

  handleLanguageChange(event) {
    this.setState({
      language_en: event.target.checked,
    });
  }

  updateListPosition() {
    var i = 0, $leftLast, $rightLast;
    $(".twitter-post, .facebook-post, .instagram-post").each(function() {
      if (i == 0) {
        $(this).css("float", "left");
        $leftLast = $(this);
      } else if (i == 1) {
        $(this).css("float", "right");
        $rightLast = $(this);
      } else {
        if ($leftLast.offset().top + $leftLast.height() < $rightLast.offset().top + $rightLast.height()) {
          $(this).css("float", "left");
          $leftLast = $(this);
        } else {
          $(this).css("float", "right");
          $rightLast = $(this);
        }
      }
      i++;
    });
  }

  // RENDER

  render() {
    const { classes, theme } = this.props;
    const { mounted, loaded, content} = this.state;

    if (!mounted || !loaded)  {
      return (
        <div className="app-loading">

        </div>
      );
    } else {

      const postsPerLoad = 5;
      const postWidth = this.state.width > 600 ? 500 : 350;
      const numberOfColumns = this.state.width > 1100 ? 2 : 1;

      var index, columns = [];
      for (index = 0; index < Math.min(this.state.rendered + postsPerLoad, content.posts.length); index++) {
        let columnIdx = 0; // index % numberOfColumns;
        if (!columns[columnIdx]) columns[columnIdx] = [];
        columns[columnIdx].push(<Post
          key={"post_" + index}
          links={content.posts[index].links} width={postWidth}
          onSocialRender={this.updateListPosition}
        />);
      }
      let contentGrid = (
        <Grid container spacing={0} style={{width: postWidth * numberOfColumns + 12 * (numberOfColumns - 1), margin: "0 auto"}}>
          <Grid item xs={12} style={{margin: theme.spacing.unit * 3}}>
            <Divider variant="middle" />
          </Grid>
          {columns.map((column, index) => (
            <Grid key={"column-" + index} item xs={12/columns.length}>
              {column}
            </Grid>
          ))}
        </Grid>
      );

      let loadMorePostsButton = index >= content.posts.length ? null: (
        <div id="load-more-button" style={{display: "flex", justifyContent: "center"}}>
          <Button color="primary" className={classes.button} onClick={this.loadMorePosts(index)}>
            Load {postsPerLoad} more posts...
          </Button>
        </div>
      );

      return (
        <div className={classes.root}>
          <CssBaseline />
          <main className={classes.content}>
            <Grid container justify="center" alignItems="center">
              HU <Switch
                checked={this.state.language_en}
                onChange={this.handleLanguageChange}
                color="default"
              /> EN
            </Grid>
            <Grid container justify="center" alignItems="center">
              <img className="avatar" alt="Antal Orcsik (Tony)" src="https://s.gravatar.com/avatar/42be615fb210779dbb3752714e14c3ec?s=256" />
            </Grid>
            <Grid container justify="center" alignItems="center">
              <Typography variant="h4" gutterBottom>
                {content.title}
              </Typography>
            </Grid>
            {content.greeting[this.state.language_en ? "en" : "hu"].map((line, index) => {
              return (<Grid key={index} className="greeting-grid" container justify="center" alignItems="center">
                <ReactMarkdown source={line} />
              </Grid>);
            })}
            <Grid container justify="center" alignItems="center" style={{marginTop: theme.spacing.unit * 2}}>
              {["http://facebook.com/aorcsik",
                "http://twitter.com/aorcsik",
                "http://linkedin.com/in/aorcsik",
                "https://dribbble.com/aorcsik"
              ].map((url, index) => {
                return (
                  <SocialIcon key={index} url={url} target="_blank" style={{ height: 32, width: 32, margin: theme.spacing.unit / 2 }} />
                );
              })}
            </Grid>
            {contentGrid}
            {loadMorePostsButton}
          </main>
        </div>
      );
    }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);

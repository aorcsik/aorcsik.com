/* global $ */

import React from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
// import classNames from "classnames";
import { Button, ButtonGroup, CssBaseline, Divider, Grid, List, ListItem, ListItemText, Menu, MenuItem, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { withStyles } from "@material-ui/core/styles";
import { SocialIcon } from "react-social-icons";

import Post from "./Post.jsx";


const styles = theme => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
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
      load_more_posts_disabled: false,
      category: "all",
      language: "hu",
      anchorEl: null
    };

    this.loadMorePostsDisabledDelay = null;

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.updateListPosition = this.updateListPosition.bind(this);
    this.handleOpenCategorySelect = this.handleOpenCategorySelect.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.handleCloseCategorySelect = this.handleCloseCategorySelect.bind(this);
  }

  componentDidMount() {
    this.setState({
      mounted: true,
      width: $(window).width(),
      loaded: true,
      content: window.__aorcsik_content
    });

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
        load_more_posts_disabled: true
      });
      window.clearTimeout(this.loadMorePostsDisabledDelay);
      this.loadMorePostsDisabledDelay = window.setTimeout(function() {
        this.setState({
          load_more_posts_disabled: false
        });
      }.bind(this), 2000);
    }.bind(this);
  }

  handleChangeLanguage(language) {
    return function() {
      this.setState({
        language: language,
      });
    }.bind(this);
  }

  updateListPosition() {
    var i = 0, $leftLast, $rightLast;
    $(".linkedin-post:visible, .twitter-post:visible, .facebook-post:visible, .instagram-post:visible").each(function() {
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

  handleOpenCategorySelect(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleSelectCategory(category) {
    return function() {
      this.setState({ category: category, rendered: 0, anchorEl: null });
    }.bind(this);
  }

  handleCloseCategorySelect() {
    this.setState({ anchorEl: null });
  }

  // RENDER

  render() {
    const { classes, theme } = this.props;
    const { mounted, loaded, content, anchorEl} = this.state;

    if (!mounted || !loaded)  {
      return (
        <div className="app-loading">

        </div>
      );
    } else {

      const postsPerLoad = 5;
      const language = this.state.language;
      const postWidth = this.state.width > 600 ? 500 : 350;
      const numberOfColumns = this.state.width > 1100 ? 2 : 1;

      var index, renderCount = 0, count = 0, column = [];
      for (index = 0; index < content.posts.length; index++) {
        let show = this.state.category == "all" || (content.posts[index].category && content.posts[index].category.indexOf(this.state.category) !== -1);
        if (count < this.state.rendered + postsPerLoad) {
          column.push(<Post
            show={show}
            key={"post_" + index}
            links={content.posts[index].links}
            width={postWidth}
            height={content.posts[index].height}
            onSocialRender={this.updateListPosition}
          />);
          if (show) renderCount++;
        }
        if (show) count++;
      }
      let contentGrid = (
        <Grid container spacing={0} style={{width: postWidth * numberOfColumns + 12 * (numberOfColumns - 1), margin: "0 auto"}}>
          <Grid item xs={12}>
            <List component="nav">
              <ListItem
                button
                onClick={this.handleOpenCategorySelect}
              >
                <ListItemText
                  primary={content.categories[this.state.category][language]}
                  secondary={count + " " + (count == 1 ? content.one_post[language] : content.many_posts[language])}
                />
                <ArrowDropDownIcon />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleCategorySelect}
            >
              {Object.keys(content.categories).map((category) => (
                <MenuItem
                  key={category}
                  selected={category === this.state.category}
                  onClick={this.handleSelectCategory(category)}
                >
                  {content.categories[category][language]}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          <Grid item xs={12} style={{marginBottom: theme.spacing(3)}}>
            <Divider variant="middle" />
          </Grid>
          <Grid item xs={12}>
            {column}
          </Grid>
        </Grid>
      );
      let loadMorePostsButton = renderCount >= count ? null : (
        <div id="load-more-button" style={{display: "flex", justifyContent: "center"}}>
          <Button
            color="primary" className={classes.button}
            disabled={this.state.load_more_posts_disabled}
            onClick={this.loadMorePosts(renderCount)}>
            Load {postsPerLoad} more posts...
          </Button>
        </div>
      );

      var huButton = this.state.language == "hu" ? (
        <Button variant="contained" color="primary" onClick={this.handleChangeLanguage("hu")}>HU</Button>
      ) : (
        <Button variant="contained" onClick={this.handleChangeLanguage("hu")}>HU</Button>
      );

      var enButton = this.state.language == "en" ? (
        <Button variant="contained" color="primary" onClick={this.handleChangeLanguage("en")}>EN</Button>
      ) : (
        <Button variant="contained" onClick={this.handleChangeLanguage("en")}>EN</Button>
      );

      return (
        <div className={classes.root}>
          <CssBaseline />
          <main className={classes.content}>
            <Grid container justify="center" alignItems="center">
              <ButtonGroup size="small"
                aria-label="small outlined button group"
                style={{position: "relative", zIndex: 1000}}>
                {huButton}
                {enButton}
              </ButtonGroup>
            </Grid>
            <br />
            <Grid container justify="center" alignItems="center">
              <img className="avatar" alt="Antal Orcsik (Tony)" src="https://s.gravatar.com/avatar/42be615fb210779dbb3752714e14c3ec?s=256" />
            </Grid>
            <Grid container justify="center" alignItems="center">
              <Typography variant="h4" gutterBottom>
                {content.title}
              </Typography>
            </Grid>
            {content.greeting[language].map((line, index) => {
              return (<Grid key={index} className="greeting-grid" container justify="center" alignItems="center">
                <ReactMarkdown source={line} />
              </Grid>);
            })}
            <Grid container justify="center" alignItems="center" style={{marginTop: theme.spacing(2)}}>
              {["https://linkedin.com/in/aorcsik",
                "https://facebook.com/aorcsik",
                "https://twitter.com/aorcsik",
                "https://instagram.com/aorcsik",
                "https://github.com/aorcsik",
                "https://dribbble.com/aorcsik"
              ].map((url, index) => {
                return (
                  <SocialIcon key={index} url={url} target="_blank" style={{ height: 32, width: 32, margin: theme.spacing(0.5) }} />
                );
              })}
            </Grid>
            <ins className="adsbygoogle"
              style={{display: "block", marginTop: "2em 0 1em 0", textAlign: "center"}}
              data-ad-client="ca-pub-7591879250553422"
              data-ad-slot="3577953018"
              data-ad-format="auto"
              data-full-width-responsive="true" />
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

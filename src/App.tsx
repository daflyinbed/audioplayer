import {
  Checkbox,
  createStyles,
  Dialog,
  Fab,
  fade,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { AppBar, CssBaseline, Toolbar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

// import { useAudio } from "./hooks/useAudio";
import React, { useCallback, useEffect, useState } from "react";
import { WidePlayerBar } from "./components/WidePlayerBar";
import { matchSorter } from "match-sorter";
import { useDebounce } from "./hooks/useDebounce ";
import { SearchList } from "./components/SearchList";
import { Playlist } from "./components/Playlist";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useMenu } from "./hooks/useMenu";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import { DownloadDialog } from "./components/DownloadDialog";
import { NarrowPlayerBar } from "./components/NarrowPlayerBar";
import { usePlayList } from "./hooks/usePlayList";
import { useAudio } from "./hooks/useAudio";
// import {useAudio} from 'react-use';
// import GetAppIcon from "@material-ui/icons/GetApp";
// import { DownloadList } from "./components/DownloadList";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    toolbar: {
      display: "flex",
      justifyContent: "center",
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        maxWidth: 600,
      },
      width: "100%",
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    },
    bottomAppBar: {
      top: "auto",
      bottom: 0,
    },
    container: {
      height: "calc(100% - 128px)",
    },
    list: {
      height: "100%",
    },
    checkbox: {
      color: "inherit",
    },
    checkboxLabel: {
      marginLeft: 0,
      flexShrink: 0,
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      bottom: theme.spacing(16),
      right: theme.spacing(4),
      margin: "0 auto",
    },
    // dialog: {
    //   height: "100%",
    // },
  });
});

function App(props: { data: string[] }) {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [isFuzzy, setIsFuzzy] = useState(false);
  const [isCaseSen, setIsCaseSen] = useState(false);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  useAudio();
  usePlayList();
  // const [audio, state, controls] = useAudio({src:""});
  const {
    states: [filterMenuState],
    open: openFilterMenu,
    close: closeFilterMenu,
  } = useMenu();
  const [openDialog, setOpenDialog] = useState(false);
  const searchCB = useCallback(() => {
    if (isFuzzy) {
      setSearchResult(matchSorter(props.data, search));
    } else {
      if (isCaseSen) {
        setSearchResult(props.data.filter((v) => v.includes(search)));
      } else {
        setSearchResult(
          props.data.filter((v) =>
            v.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }
  }, [props.data, search, isFuzzy, isCaseSen]);
  const calc = useDebounce(searchCB, 600);
  useEffect(() => {
    setSearchResult(props.data);
  }, [props.data]);
  useEffect(() => {
    calc();
  }, [calc]);
  return (
    <div style={{ height: "100%" }}>
      <CssBaseline />
      {/* {AudioEle} */}
      <AppBar position="absolute">
        <Toolbar classes={{ root: classes.toolbar }}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="搜索…"
              inputProps={{ "aria-label": "search" }}
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
              onChange={(e) => {
                setSearch(e.target.value);
                calc();
              }}
              onBlur={() => {
                calc.cancel();
                calc();
              }}
            />
          </div>
          <IconButton
            color="inherit"
            onClick={(e) => {
              openFilterMenu(e.currentTarget, -1);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container className={classes.container}>
        {md ? (
          <>
            <Grid md={6} xs={12} item className={classes.list}>
              <SearchList list={searchResult} len={props.data.length} />
            </Grid>
            <Grid md={6} xs={12} item className={classes.list}>
              <Playlist />
            </Grid>
          </>
        ) : (
          <SearchList
            className={classes.list}
            list={searchResult}
            len={props.data.length}
          />
        )}
      </Grid>
      <AppBar position="fixed" className={classes.bottomAppBar}>
        {sm ? <WidePlayerBar /> : <NarrowPlayerBar />}
      </AppBar>
      <Menu
        anchorEl={filterMenuState.anchor}
        keepMounted
        open={!!filterMenuState.anchor}
        onClose={() => {
          closeFilterMenu();
        }}
      >
        <MenuItem>
          <FormControlLabel
            label="模糊"
            classes={{ root: classes.checkboxLabel }}
            control={
              <Checkbox
                checked={isFuzzy}
                classes={{ root: classes.checkbox }}
                onChange={(_, checked) => {
                  setIsFuzzy(checked);
                }}
                color="secondary"
              />
            }
          ></FormControlLabel>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="大小写敏感"
            classes={{ root: classes.checkboxLabel }}
            disabled={isFuzzy}
            control={
              <Checkbox
                checked={isFuzzy ? isFuzzy : isCaseSen}
                classes={{ root: classes.checkbox }}
                onChange={(_, checked) => {
                  setIsCaseSen(checked);
                }}
                color="secondary"
              />
            }
          ></FormControlLabel>
        </MenuItem>
      </Menu>
      {!md ? (
        <Fab
          className={classes.fabButton}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <QueueMusicIcon />
        </Fab>
      ) : null}
      <Dialog fullScreen open={!md && openDialog}>
        <Playlist
          isDialog={true}
          onClose={() => {
            setOpenDialog(false);
          }}
        />
      </Dialog>
      <DownloadDialog />
    </div>
  );
}

export default App;

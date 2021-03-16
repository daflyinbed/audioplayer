import {
  Checkbox,
  createStyles,
  Dialog,
  Fab,
  fade,
  FormControlLabel,
  Grid,
  InputBase,
  Theme,
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
import { useSensor } from "./hooks/useSensor";
import GetAppIcon from "@material-ui/icons/GetApp";
import { DownloadList } from "./components/DownloadList";
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
      bottom: theme.spacing(8),
      right: theme.spacing(4),
      margin: "0 auto",
    },
    dialog: {
      height: "100%",
    },
  });
});
interface Props {
  data: string[];
}
function App(props: Props) {
  const classes = useStyles();
  console.log("re render");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [isFuzzy, setIsFuzzy] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const searchCB = useCallback(() => {
    if (isFuzzy) {
      console.log("fuzzy search", search);
      setSearchResult(matchSorter(props.data, search));
    } else {
      console.log("search", search);
      setSearchResult(props.data.filter((v) => v.includes(search)));
    }
  }, [props.data, search, isFuzzy]);
  const calc = useDebounce(searchCB, 1000);
  useEffect(() => {
    setSearchResult(props.data);
  }, [props.data]);
  useEffect(() => {
    calc();
  }, [calc]);
  return (
    <div style={{ height: "100%" }}>
      <CssBaseline />
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
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container className={classes.container}>
        <Grid md={6} xs={12} item className={classes.list}>
          <SearchList list={searchResult} />
        </Grid>
        <Grid md={6} xs={12} item className={classes.list}>
          <Playlist />
        </Grid>
      </Grid>
      <Toolbar />
      <AppBar position="fixed" className={classes.bottomAppBar}>
        <WidePlayerBar />
      </AppBar>
      <Fab
        className={classes.fabButton}
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        <GetAppIcon />
      </Fab>
      <Dialog
        onClose={() => {
          setOpenDialog(false);
        }}
        fullWidth
        maxWidth="md"
        aria-labelledby="simple-dialog-title"
        open={openDialog}
        classes={{ paper: classes.dialog }}
        className={classes.dialog}
      >
        <DownloadList />
      </Dialog>
    </div>
  );
}

export default App;

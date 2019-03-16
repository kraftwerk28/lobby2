import React from 'react'
import {
  Grid,
  Typography,
  Paper,

  Table,
  TableBody as Tbody,
  TableHead as Thead,
  TableRow as Tr,
  TableCell as Tc,
  TablePagination,
  TableFooter,

  CircularProgress,
  IconButton,
  Icon,
  Zoom,
  Fab,
} from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

import { getToken } from '../token'

import _fetch from '../jsonfetch'

const styles = {
  rootGrid: {
    overflowX: 'auto',
  },
  paper: {
    overflow: 'auto',
    height: '100%'
  },
  paginationSpacer: {
    display: 'none'
  },
  fab: {
    position: 'fixed',
    bottom: 8,
    right: 8,
  }
}

const showLessColumns = [
  'time', 'country', 'city'
]

class VTable extends React.Component {
  state = {
    tableData: [],
    tableHead: [],
    curTablePage: 0,
    rowsPerPage: 25,
    showMore: false,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    _fetch('/visittable', {
      body: { token: getToken() }
    }).then(_ => _.json()).then(d => {
      this.setState({
        tableData: d,
        tableHead: Object.keys(d[0])
      })
    })
  }

  changePageHandler = (event, page) => {
    this.setState({ curTablePage: page })
  }

  changeRowsPerPageHandler = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  switchExpanded = () => {
    this.setState(prev => ({
      showMore: !prev.showMore
    }))
  }

  render() {
    const {
      curTablePage, rowsPerPage,
      showMore, tableData, tableHead
    } = this.state
    const { classes } = this.props

    return (
      <Grid
        container
        alignItems='center'
        direction='column'
        className={classes.rootGrid}
      >
        {tableData.length
          ? <Paper className={classes.paper}>
            <Table>
              <Thead>
                <Tr>
                  <TablePagination
                    classes={{
                      spacer: classes.paginationSpacer
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={curTablePage}
                    onChangePage={this.changePageHandler}
                    onChangeRowsPerPage={this.changeRowsPerPageHandler}
                  />
                </Tr>
                <Tr>
                  {showMore ?
                    tableHead.map((d, i) => <Tc key={i}>{d}</Tc>) :
                    showLessColumns.map((d, i) => <Tc key={i}>{d}</Tc>)
                  }
                </Tr>
              </Thead>
              <Tbody>
                {tableData
                  .slice(curTablePage * rowsPerPage,
                    curTablePage * rowsPerPage +
                    rowsPerPage)
                  .map((row, i) => (
                    <Tr key={i}>
                      {showMore
                        ? Object.values(row).map((d, _i) => (
                          <Tc
                            key={row.record_id * tableHead.length + _i}
                          >{d}</Tc>
                        ))
                        : showLessColumns.map((col, _i) => (
                          <Tc key={row.record_id * showLessColumns.length + _i}>
                            {row[col]}
                          </Tc>))}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Paper>
          : <CircularProgress style={{ margin: 20 }} />}

        <Fab
          className={classes.fab}
          color='primary'
          onClick={this.switchExpanded}
        >
          <Icon>{'unfold_' + (showMore ? 'less' : 'more')}</Icon>
        </Fab>
      </Grid>
    )
  }
}

export default withStyles(styles)(VTable)

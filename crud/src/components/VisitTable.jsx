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
  Icon
} from '@material-ui/core'

import { getToken } from '../token'

import _fetch from '../jsonfetch'

const showLessColumns = [
  'platform', 'time', 'country', 'city', 'org'
]

const AdditionActions = (props) => (
  <Tc>
    <div>
      <IconButton onClick={() => props.toggleShowMore()}>
        <Icon>{'unfold_' + (props.expanded ? 'less' : 'more')}</Icon>
      </IconButton>
    </div>
  </Tc>
)

const AdditionActionsHOC = (_this) => (
  <AdditionActions
    expanded={_this.state.showMore}
    toggleShowMore={() => _this.setState(prev => ({
      showMore: !prev.showMore
    }))}
  />
)

class VTable extends React.Component {
  tableData = []
  tableHead = []
  state = {
    curTablePage: 0,
    rowsPerPage: 25,
    showMore: false,
  }

  constructor(props) {
    super(props)

    _fetch('/visittable', {
      body: { token: getToken() }
    }).then(_ => _.json()).then(d => {
      this.tableData = d
      this.tableHead = Object.keys(d[0])
      this.forceUpdate()
    })
  }

  changePageHandler = (event, page) => {
    this.setState({ curTablePage: page })
  }

  changeRowsPerPageHandler = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  render() {
    const { curTablePage, rowsPerPage, showMore } = this.state
    const [tableData, tableHead] = [this.tableData, this.tableHead]

    return (
      <Grid
        container
        alignItems='center'
        direction='column'
      >
        {tableData.length ?
          <Paper
            style={{
              width: '100%',
              overflow: 'auto',
              margin: 10,
              height: '100%'
            }}
          >
            <Table>
              <Thead>
                <Tr>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={curTablePage}
                    onChangePage={this.changePageHandler}
                    onChangeRowsPerPage={this.changeRowsPerPageHandler}
                  />
                  {AdditionActionsHOC(this)}
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
                      {showMore ?
                        Object.values(row).map((d, _i) => (
                          <Tc key={row.id * 7 + _i}>{d}</Tc>
                        )) :
                        showLessColumns.map((col, _i) => (
                          <Tc key={row.id * showLessColumns.length + _i}>
                            {row[col]}
                          </Tc>))}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Paper> : <CircularProgress style={{ margin: 20 }} />}

      </Grid>
    )
  }
}

export default VTable

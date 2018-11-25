import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'

import PropTypes from 'prop-types'

import ClientRow from 'components/ClientRow'
import ClientModal from 'components/ClientModal'
import NetworkOperation from 'utils/NetworkOperation'
import { withSaver } from 'utils/portals'

import './styles.pcss'

class Clients extends Component {
  static propTypes = {
    saving: PropTypes.any,
    stopSaving: PropTypes.any,
    toggle: PropTypes.any,
  }

  state = {
    search: '',
    rows: [],
    anchorEl: null,
    addUserModalOpen: false,
    admin: true,
  }

  async componentDidMount() {
    this.props.toggle({ saveButton: false, dateFilter: false })

    try {
      let users = await NetworkOperation.getUsers()
      users = users.data.users || []

      this.setState({ rows: users })
    } catch (error) {
      console.log({ error })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.saving && !prevProps.saving) {
      this.onSave()
    }
  }

  componentWillUnmount() {
    this.props.stopSaving(null)
  }

  onSave() {
    setTimeout(() => {
      this.props.stopSaving(true)
    }, 10000)
  }

  handleClose = () => this.setState({ anchorEl: null })

  handleClick = (event) => this.setState({ anchorEl: event.currentTarget })

  toggleUserAddModal = (isOpen = null) => () =>
    this.setState(({ prev }) => ({
      addUserModalOpen: isOpen !== null ? isOpen : !prev.addUserModalOpen,
    }))

  render() {
    const {
      state: { search, rows, anchorEl, addUserModalOpen, admin, user = '' },
    } = this

    return (
      <div className="clients">
        <ClientModal
          toggleUserAddModal={this.toggleUserAddModal}
          addUserModalOpen={addUserModalOpen}
        />
        <div className="actions">
          <TextField
            id="standard-name"
            label="Buscar"
            className="text-field"
            value={search}
            onChange={() => {}}
            margin="normal"
          />
          <div className="buttons">
            <Button
              color="primary"
              className="button"
              onClick={this.toggleUserAddModal(true)}
            >
              Nuevo usuario
            </Button>
            <Button color="secondary" className="button" variant="contained">
              Exportar
            </Button>
          </div>
        </div>
        <Card>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Indexación</TableCell>
                <TableCell>API Keys</TableCell>
                <TableCell numeric />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item) => <ClientRow {...item} key={item._id} />)}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }
}

export default withSaver(Clients)

import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { type Product } from '@/types/cart'

// Définir les types de données que nous recevrons
type ShippingAddress = { name: string; email: string; phone: string; address: string; city: string }
type Order = {
  id: string
  total_dhs: number
  created_at: string
  shipping_address: ShippingAddress
}
type OrderItem = {
  quantity: number
  unit_price_dhs: number
  products: Product
}

// Définir les styles (très similaire à CSS, mais pour les PDF)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 30,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  h2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555555',
  },
  text: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 3,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%', // Adjust width as needed
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#F8F8F8',
    padding: 6,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalWrapper: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 11,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 9,
  },
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// C'est notre composant de facture
export const InvoiceDocument = ({ order, items }: { order: Order, items: OrderItem[] }) => {
  const logoUrl = "https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/Gemini_Generated_Image_upk0z5upk0z5upk0%201.svg"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image style={styles.logo} src={logoUrl} />
            <Text style={styles.text}>IH Cosmetics</Text>
            <Text style={styles.text}>Casablanca, Maroc</Text>
            <Text style={styles.text}>contact@ihcosmetics.ma</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.h1}>FACTURE</Text>
            <Text style={styles.text}>N°: {order.id.substring(0, 8)}</Text>
            <Text style={styles.text}>Date: {formatDate(order.created_at)}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.h2}>Facturé à :</Text>
          <Text style={styles.text}>{order.shipping_address.name}</Text>
          <Text style={styles.text}>{order.shipping_address.address}</Text>
          <Text style={styles.text}>{order.shipping_address.city}, Maroc</Text>
          <Text style={styles.text}>{order.shipping_address.phone}</Text>
          <Text style={styles.text}>{order.shipping_address.email}</Text>
        </View>

        {/* Table des produits */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{...styles.tableColHeader, width: '40%'}}><Text style={styles.tableHeader}>Produit</Text></View>
            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableHeader}>Quantité</Text></View>
            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableHeader}>Prix Unitaire</Text></View>
            <View style={{...styles.tableColHeader, width: '20%'}}><Text style={styles.tableHeader}>Total</Text></View>
          </View>
          {items.map(item => (
            <View style={styles.tableRow} key={item.products.id}>
              <View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{item.products.name}</Text></View>
              <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{item.quantity}</Text></View>
              <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{item.unit_price_dhs.toFixed(2)} DHS</Text></View>
              <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{(item.unit_price_dhs * item.quantity).toFixed(2)} DHS</Text></View>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalWrapper}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>{order.total_dhs.toFixed(2)} DHS</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Livraison</Text>
              <Text style={styles.totalValue}>0.00 DHS</Text>
            </View>
            <View style={{...styles.totalRow, borderTopWidth: 1, borderColor: '#EEEEEE', paddingTop: 5, marginTop: 5}}>
              <Text style={{...styles.totalLabel, fontSize: 14, fontWeight: 'bold'}}>Total</Text>
              <Text style={{...styles.totalValue, fontSize: 14}}>{order.total_dhs.toFixed(2)} DHS</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Merci pour votre achat.
        </Text>
      </Page>
    </Document>
  )
}
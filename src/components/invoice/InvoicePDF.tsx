/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const logoUrl = "https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/Gemini_Generated_Image_upk0z5upk0z5upk0%201.png"

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    borderBottomStyle: 'solid', 
    paddingBottom: 10 
  },
  
  // Style pour le logo
  logo: { 
    width: 100, 
    height: 50, 
    objectFit: 'contain',
    marginBottom: 5
  },

  title: { fontSize: 14, color: '#666', textTransform: 'uppercase' },
  
  section: { marginBottom: 20 },
  label: { fontSize: 10, color: '#666', marginBottom: 4 },
  value: { fontSize: 12, marginBottom: 2 },
  
  table: { 
    width: '100%', 
    marginTop: 20, 
    borderWidth: 1, 
    borderStyle: 'solid', 
    borderColor: '#EEE', 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  },
  
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    borderBottomStyle: 'solid' 
  },
  
  tableHeader: { backgroundColor: '#F9FAFB', fontWeight: 'bold', fontSize: 10, color: '#444' },
  
  colDesc: { width: '50%', padding: 8, borderRightWidth: 1, borderRightColor: '#EEE', borderRightStyle: 'solid' },
  colQty: { width: '15%', padding: 8, borderRightWidth: 1, borderRightColor: '#EEE', borderRightStyle: 'solid', textAlign: 'right' },
  colPrice: { width: '15%', padding: 8, borderRightWidth: 1, borderRightColor: '#EEE', borderRightStyle: 'solid', textAlign: 'right' },
  colTotal: { width: '20%', padding: 8, borderRightWidth: 1, borderRightColor: '#EEE', borderRightStyle: 'solid', textAlign: 'right' },
  
  totalSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  totalRow: { flexDirection: 'row', marginBottom: 5 },
  totalLabel: { width: 100, textAlign: 'right', paddingRight: 10, color: '#666' },
  totalValue: { width: 80, textAlign: 'right', fontWeight: 'bold' },
  
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    textAlign: 'center', 
    fontSize: 10, 
    color: '#999', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    borderTopStyle: 'solid', 
    paddingTop: 10 
  }
})

export const InvoicePDF = ({ order }: { order: any }) => {
  const address = order.shipping_address || {}
  const date = new Date(order.created_at).toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            {/* --- LOGO ICI --- */}
            <Image src={logoUrl} style={styles.logo} />
            {/* ---------------- */}
            <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Casablanca, Maroc</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>Facture</Text>
            <Text style={{ fontSize: 10, marginTop: 4 }}>N° {order.id.substring(0, 8)}</Text>
            <Text style={{ fontSize: 10 }}>{date}</Text>
          </View>
        </View>

        {/* Info Client */}
        <View style={styles.section}>
          <Text style={styles.label}>FACTURÉ À :</Text>
          <Text style={styles.value}>{address.name}</Text>
          <Text style={styles.value}>{address.address}</Text>
          <Text style={styles.value}>{address.city}, Maroc</Text>
          <Text style={styles.value}>{address.phone}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>Prix U.</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          
          {order.order_items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.products.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.unit_price_dhs.toFixed(2)}</Text>
              <Text style={styles.colTotal}>{(item.quantity * item.unit_price_dhs).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totalSection}>
          <View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total :</Text>
              <Text style={styles.totalValue}>{order.total_dhs.toFixed(2)} DHS</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Livraison :</Text>
              <Text style={styles.totalValue}>Gratuite</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 5 }]}>
              <Text style={[styles.totalLabel, { color: 'black', fontWeight: 'bold' }]}>TOTAL :</Text>
              <Text style={[styles.totalValue, { fontSize: 14 }]}>{order.total_dhs.toFixed(2)} DHS</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Merci pour votre confiance. contact@ihcosmetics.ma
        </Text>
      </Page>
    </Document>
  )
}